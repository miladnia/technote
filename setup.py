from setuptools import setup, find_packages

setup(
    name="pytechnote",
    version="0.2.0",
    packages=find_packages(include=["technote", "technote.*"]),
    include_package_data=True,  # include non-Python files inside app/
    entry_points={
        'console_scripts': [
            'technote=technote.cli:main',
        ],
    },
    install_requires=[
        "Flask==3.0.3",
        "pypandoc-binary==1.14",
    ],
)
