import os
from flask import Flask, jsonify, render_template, request
app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

#===============================================================================
# PROJECTS
#===============================================================================
@app.route('/_create_project')
def create_project():
    name = request.args.get('name', 0, type=str)
    description = request.args.get('description', 0, type=str)
    exists = os.path.isdir("projects/name")
    if not exists:
        return jsonify(success=False, message="<strong>Error: </strong>Project with that name already exists!")
    return jsonify(success=True)

#===============================================================================
# MODEL
#===============================================================================
@app.route('/_add_numbers')
def add_numbers():
    a = request.args.get('a', 0, type=int)
    b = request.args.get('b', 0, type=int)
    return jsonify(result=a + b)

#===============================================================================
# END
#===============================================================================
if __name__ == '__main__':
    app.run(
        host="127.0.0.1",
        port=int("5000"),
        debug=True
    )
