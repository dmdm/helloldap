import os

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(here, 'README.md')) as fh:
    README = fh.read()
with open(os.path.join(here, 'CHANGES.md')) as fh:
    CHANGES = fh.read()


setup(
    name='helloLDAP',
    version='0.0.1',
    description='helloLDAP',
    long_description=README + '\n\n' + CHANGES,
    classifiers=[
        "Programming Language :: Python",
        "Topic :: Internet :: WWW/HTTP",
    ],
    author='Dirk Makowski',
    author_email='dirk.makowski@gmail.com',
    url='',
    keywords='',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=[],
    tests_require=[],
    test_suite="helloldap",
    entry_points="""\
      [console_scripts]
      serve = helloldap.scripts.serve:main
      """
)
