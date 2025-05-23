from flask import Flask
from flask_cors import CORS

from routes.ride_stats import ride_stats

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(ride_stats)

@app.route("/")
def home():
    return {"message": "Uber Ride Data Analysis API is running 🚀"}

if __name__ == "__main__":
    app.run(debug=True)
