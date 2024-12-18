# spotsat-BackEnd
## API Endpoints
### User Login
```
POST /login
```
- **Request Body**: 
    ```json
    {
        "username": "user123",
        "password": "password123"
    }
    ```
- **Response**: 
    ```json
    {
        "message": "Login bem-sucedido",
        "token": "access_token",
        "username": "user123"
    }
    ```

### Refresh Token
```
POST /refresh-token
```
- **Response**: 
    ```json
    {
        "accessToken": "new_access_token"
    }
    ```
### Create Polygon
```
POST /polygons
```
- **Request Body**: 
    ```json
    {
        "features": [
            {
                "properties": {
                    "name": "Polygon Name"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [...]
                }
            }
        ]
    }
    ```
- **Response**: 
    ```json
    {
        "id": 1,
        "geometry": {...},
        "name": "Polygon Name",
        "properties": {...},
        "centroid": {...},
        "area_hectares": 123.45,
        "userId": 1
    }
    ```

### Get All Polygons
```
GET /polygons
```
- **Response**: 
    ```json
    [
        {
            "id": 1,
            "geometry": {...},
            "name": "Polygon Name",
            "properties": {...},
            "centroid": {...},
            "area_hectares": 123.45,
            "userId": 1
        },
        ...
    ]
    ```

### Get Polygon by ID
```
GET /polygons/:id
```
- **Response**: 
    ```json
    {
        "id": 1,
        "geometry": {...},
        "name": "Polygon Name",
        "properties": {...},
        "centroid": {...},
        "area_hectares": 123.45,
        "userId": 1
    }
    ```

### Get Polygon Interests
```
GET /polygons/:id/interests
```
- **Response**: 
    ```json
    [
        {
            "id": 2,
            "geometry": {...},
            "name": "Another Polygon",
            "properties": {...}
        },
        ...
    ]
    ```

### Update Polygon
```
PUT /polygons/:id
```
- **Request Body**: 
    ```json
    {
        "features": [
            {
                "properties": {
                    "name": "Updated Polygon Name"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [...]
                }
            }
        ]
    }
    ```
- **Response**: 
    ```json
    {
        "id": 1,
        "geometry": {...},
        "name": "Updated Polygon Name",
        "properties": {...},
        "centroid": {...},
        "area_hectares": 123.45,
        "userId": 1
    }
    ```

### Delete Polygon
```
DELETE /polygons/:id
```
- **Response**: 
    ```json
    {}
    ```

### Search Polygons
```
GET /polygons/search
```
- **Query Parameters**: 
    - `latitude`: Latitude of the center point
    - `longitude`: Longitude of the center point
    - `radius`: Search radius in meters
- **Response**: 
    ```json
    [
        {
            "id": 1,
            "geometry": {...},
            "name": "Polygon Name",
            "properties": {...}
        },
        ...
    ]
    ```