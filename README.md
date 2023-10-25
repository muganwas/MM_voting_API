## Creat Campaign

# URI: https://octagonal-ancient-feverfew.glitch.me/api/v1
# EndPoint: /campaigns/create
# Method: POST

1 - send formData: { name: string, categoryIds: string, file, companyName: string, brandName: string, agencyName: string, intro: string, emailAddress: string }
NOTE: categoryIds should be a comma separated string 
2 - response format: { result: boolean, data?: { name: string, companyId: string, fileURL, categoryIds: string[], brandName: string, agencyId: string, emailAddress: string, timeStamp: string }, message: string }

# categoryIds should be fetched from API, see Fetch Categories section

## Creat Category

# URI: https://octagonal-ancient-feverfew.glitch.me/api/v1
# EndPoint: /categories/create
# Method: POST
# Content-Type: application/json

1 - send body: { name: string, desc: string }
2 - you get back a json response that should be parsed.
3 - response format: { result: boolean, data?: { name: string, desc: string, timeStamp: string }, message: string }

# categoryIds should be fetched from API

## Fetch Categories

# URI: https://octagonal-ancient-feverfew.glitch.me/api/v1
# EndPoint: /categories
# params: page, limit (these are optional, default is page 1, limit 10)
# Method: GET

1 - Response is in json format and needs to be parsed.
2 - response format: { result: bool, data?: {id: string, name: string, desc: string, timeStamp: string}[], metada: { page: number, pages: number, limit: number} }
