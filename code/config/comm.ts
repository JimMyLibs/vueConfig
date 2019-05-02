
export const apiVersion = '3.0.0'

// export const apiUrl = `${location.origin}/h5/h5-base/json/apiSource.${apiVersion}.json`


export const apiUrl = `${location.href.replace(/#.*$/g, '')}/static/api.json`

