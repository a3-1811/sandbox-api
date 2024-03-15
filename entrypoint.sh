#!/bin/bash

LANGUAGE=$1
CODE=$2

case $LANGUAGE in
    python)
        echo "$CODE" > code.py
        python3 code.py
        ;;
    java)
        echo "$CODE" > Main.java
        javac Main.java
        java Main
        ;;
    # Add cases for other languages as needed
    *)
        echo "Unsupported language"
        exit 1
        ;;
esac
