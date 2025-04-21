from setuptools import setup, find_packages
from pathlib import Path

PROJECT_DIR = Path(__file__).parent
readme_text = (PROJECT_DIR / "README.md").read_text()

setup(
    name="pytechnote",
    version="0.2.0.dev1",
    author="Milad Nia",
    author_email="miladniaa@gmail.com",
    url="https://github.com/miladnia/technote",
    license="MIT",
    long_description=readme_text,
    long_description_content_type="text/markdown",
    packages=find_packages(include=["technote", "technote.*"]),
    include_package_data=True,  # include non-Python files
    python_requires=">=3.10",
    classifiers=[
        "Development Status :: 4 - Beta",
        "Environment :: Web Environment",
        "Framework :: Flask",
        "Intended Audience :: Developers",
        "Intended Audience :: End Users/Desktop",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.10",
        "Topic :: Office/Business :: Scheduling",
        "Topic :: Text Processing :: Markup :: Markdown",
        "Topic :: Software Development :: Documentation",
        "Topic :: Utilities",
    ],
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
