# Use the official Python image from Amazon ECR Public Gallery
FROM public.ecr.aws/docker/library/python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
# CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
ENTRYPOINT ["python3"]
CMD ["-m", "gunicorn", "-w", "1", "-b", "0.0.0.0:8000", "-k", "uvicorn.workers.UvicornWorker", "--certfile", "/etc/letsencrypt/live/innovation-sg.ch/fullchain.pem", "--keyfile", "/etc/letsencrypt/live/innovation-sg.ch/privkey.pem", "app:app"]

# docker build -t backend . 