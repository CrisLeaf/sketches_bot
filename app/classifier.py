from tensorflow.keras.applications import MobileNet
from tensorflow.keras.optimizers import Adam


size = 64
num_classes = 340
BASE_SIZE = 550

model = MobileNet(input_shape=(size, size, 1), alpha=1, weights=None, classes=num_classes)
model.compile(optimizer=Adam(learning_rate=0.002), loss="categorical_crossentropy")

model.load_weights("app/classifier_weights.h5")
