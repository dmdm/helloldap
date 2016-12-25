Hello LDAP
==========

faich Fiadh fiú fogh feum!

This is no finished product!

I had some time at hand and dabbled a bit with an asyncio server in Python
and authorization with JSON Web Tokens. That's all.

And yes, the client uses the store pattern and all components are OnPush.


Installation
------------

helloLDAP is best installed and run inside a virtual environment, containing python 3.5+.

1. Ensure, pip and sister tools are up-to-date:

       pip install --upgrade pip wheel setuptools virtualenv

1. Install the required packages:

        pip install -r requirements.txt

1. Setup helloLDAP:

        pip install -e .


Documentation
-------------

Open ``doc/_build/html/index.html`` in your web browser.

Optionally, create or update the docs:

    cd doc
    make html


Run
---

Start the server with:

    serve -vv

The script has some help integrated:

    serve --help

Then go to the client and start the development server:

    cd client/helloldap
    ng serve

Navigate your browser to http://localhost:4200.
