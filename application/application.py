from flask import Blueprint, render_template, request
import numpy as np
import cv2
import base64
import pandas as pd
from .classifier import model
from .categories import all_categories


bp = Blueprint("application", __name__, url_prefix="/")

@bp.route("/", methods=["GET"])
def drawing():
	predictions = []
	probas = []
	return render_template("drawing.html",
						   predictions=predictions, probas=probas)

@bp.route("/", methods=["POST"])
def prediction():
	canvasdata = request.form["canvasimg"]
	input_image = request.form["canvasimg"].split(",")[1]
	
	input_image = np.fromstring(base64.b64decode(input_image), np.uint8)
	input_image = cv2.imdecode(input_image, cv2.IMREAD_COLOR)
	
	input_image = cv2.cvtColor(input_image, cv2.COLOR_BGR2GRAY)
	
	input_image = cv2.resize(input_image, (64, 64), interpolation=cv2.INTER_LINEAR)
	
	input_image = input_image * (-2) / 255. + 1
	
	input_image = np.expand_dims(input_image, axis=0)
	input_image = np.expand_dims(input_image, axis=3)
	
	predictions = model.predict(input_image, batch_size=128, verbose=1)
	probas = np.sort(-predictions, axis=1)[:, :3]
	probas = [f"{-proba:.1%}" for proba in probas[0]]
	
	predictions = pd.DataFrame(np.argsort(-predictions, axis=1)[:, :3], columns=['a', 'b', 'c'])
	predictions = predictions.replace(all_categories)
	predictions = predictions.values[0]
	
	if np.amax(input_image) == -1.0:
		predictions = []
		probas = []
	
	return render_template("drawing.html", canvasdata=canvasdata,
						   predictions=predictions, probas=probas)
