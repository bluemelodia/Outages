FROM nginx:alpine

# Copy your frontend files
COPY frontend/ /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]