#!/bin/bash

#Start server
python manage.py runserver 8000 &

#Get tunneling address
/Applications/ngrok -authtoken QJyvO8UsWuU4qv7urnEO 8000
