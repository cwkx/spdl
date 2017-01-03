import os, lmdb, re, shutil
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
    name = request.args.get('name', 0, type=str)
    description = request.args.get('description', 0, type=str)

    # check name is valid
    if not re.match("^[a-z0-9-]*$", name):
        return jsonify(success=False, message='Project name should only contain lowercase letters, numbers or hyphens!')

    # create project if folder doesn't exist, else return error message
    path = 'projects/'+name
    if path == 'projects/':
        return jsonify(success=False, message='Project name is empty!')
    try:
        os.makedirs(path)
    except OSError:
        if not os.path.isdir(path):
            return jsonify(success=False, message='Could not create a project folder with that name!')
        return jsonify(success=False, message='Project with that name already exists!')

    # create the database
    env = lmdb.open(path+'/database', max_dbs=10)
    meta = env.open_db(b'meta')
    inputs = env.open_db(b'inputs')
    outputs = env.open_db(b'outputs')

    # store name and description
    with env.begin(write=True) as txn:
        txn.put(b'name', name.encode(), db=meta)
        txn.put(b'description', description.encode(), db=meta)

    env.close()

    return jsonify(success=True)

@app.route('/delete-project')
def deleteProject():
    name = request.args.get('name', 0, type=str)
    path = 'projects/'+name
    shutil.rmtree(path, ignore_errors=True, onerror=None)
    return jsonify(True)

@app.route('/list-projects')
def listProjects():
    return jsonify(next(os.walk('projects'))[1])

def humanSize(num, suffix='B'):
    for unit in ['','Ki','Mi','Gi','Ti','Pi','Ei','Zi']:
        if abs(num) < 1024.0:
            return "%3.1f %s%s" % (num, unit, suffix)
        num /= 1024.0
    return "%.1f %s%s" % (num, 'Yi', suffix)

@app.route('/project-meta')
def projectMeta():
    name = request.args.get('name', 0, type=str)
    path = 'projects/'+name+'/database'
    env = lmdb.open(path, max_dbs=10, readonly=True)
    meta = env.open_db(b'meta')
    size = humanSize(sum( os.path.getsize(os.path.join(dirpath,filename)) for dirpath, dirnames, filenames in os.walk(path) for filename in filenames ))
    json = None
    with env.begin(db=meta) as txn:
        json = jsonify(name=txn.get(b'name').decode(), description=txn.get(b'description').decode(), size=size)
    env.close()
    return json

@app.route('/update-project')
def updateProject():
    name = request.args.get('name', 0, type=str)
    newName = request.args.get('newName', 0, type=str)
    description = request.args.get('description', 0, type=str)

    # check name is valid
    if not re.match("^[a-z0-9-]*$", newName):
        return jsonify(success=False, message='Project name should only contain lowercase letters, numbers or hyphens!')

    # now rename the folders
    if newName == '':
        return jsonify(success=False, message='Project name is empty!')
    try:
        os.rename('projects/'+name, 'projects/'+newName)
    except OSError:
        if not os.path.isdir('projects/'+newName):
            return jsonify(success=False, message='Could not create a project folder with that name!')
        return jsonify(success=False, message='Project with that name already exists!')

    # now write the entry
    path = 'projects/'+newName+'/database'
    env = lmdb.open(path, max_dbs=10)
    meta = env.open_db(b'meta')
    with env.begin(db=meta,write=True) as txn:
        txn.replace(b'name', newName.encode(), db=meta)
        txn.replace(b'description', description.encode(), db=meta)
    env.close()

    return jsonify(success=True)

#===============================================================================
# MODEL
#===============================================================================
@app.route('/list-files')
def listFiles():
    name = request.args.get('name', 0, type=str)
    path = 'projects/'+name
    files = []
    contents = []
    for file in os.listdir(path):
        if file.endswith(".py"):
            with open(path+'/'+file, 'r') as myfile:
                contents.append(myfile.read())
                files.append(file)
    print(contents)
    return jsonify(files=files,contents=contents)

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
