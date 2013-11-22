# Demo Site

## Setting up an Environment

### pyenv

Install pyenv by following instructions at https://github.com/yyuu/pyenv#installation

### Clone this repo

```
git clone https://github.com/gofflab/neuron-seq-site
```

### Install dependencies

Navigate to the code:

```
cd neuron-seq-site
```

Using pyenv, we can safely install a complete development environment. First we
use pyenv to install the version of python we are using. Then, we use pip to
install the libraries we depend on:

```
pyenv install
pip install -r requirements.txt
```

## Running

To run the server on port 8000:

```
python manage.py runserver 0.0.0.0:8000
```
