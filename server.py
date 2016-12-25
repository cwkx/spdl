import os
from flask import Flask, jsonify, render_template, request
app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

#===============================================================================
# PROJECTS
#===============================================================================
@app.route('/create-project')
def createProject():
    name = "projects/"+request.args.get('name', 0, type=str)
    if name == "projects/":
        return jsonify(success=False, message="<strong>Error: </strong>Project name is empty!")
    try:
        os.makedirs(name)
    except OSError:
        if not os.path.isdir(name):
            return jsonify(success=False, message="<strong>Error: </strong>Could not create a project folder with that name!")
        return jsonify(success=False, message="<strong>Error: </strong>Project with that name already exists!")

    # todo, parse description and put it into lmdb
    description = request.args.get('description', 0, type=str)

    return jsonify(success=True)

@app.route('/list-projects')
def listProjects():
    return jsonify(next(os.walk('projects'))[1])

#===============================================================================
# MODEL
#===============================================================================
@app.route('/add-numbers')
def addNumbers():
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
