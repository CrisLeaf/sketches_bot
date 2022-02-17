from flask import (
	Blueprint, render_template, request
)


bp = Blueprint("main", __name__, url_prefix="/")

@bp.route("/", methods=["GET"])
def drawing():
	return render_template("drawing.html")

@bp.route("/", methods=["POST"])
def prediction():
	print("ASDF")
