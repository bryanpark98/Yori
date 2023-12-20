const environment = process.env.NODE_ENV;
const isDevelopment = environment === 'development';
const isProduction = environment === 'production';
const port = process.env.PORT || 3000;
const jwtSecretKey = process.env.JWT_SECRET_KEY || 'secret';
const mongoUrl =
  'mongodb+srv://server:IUefA0xUdn2lVZd4@yori.1ufdlsk.mongodb.net/?retryWrites=true&w=majority';
const firebaseKey = {
  type: 'service_account',
  project_id: 'yori-d3f4e',
  private_key_id: '37db2f43524b7b0a9db2984c69fc5b8d495ddce0',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDBt1Xrdp0a+Tng\n2QCWMd2uPAwZxDW8IZcqWGSRmd8GqQFWql2vUicT5/8bhNlgoFEy1lw6/rE5kZsr\ndIo/unuuGHr1oWSs3tFpHYQwcmO0u7YSu9oyLnb7UZM19FY7sDy+ffoP/M7ovzvj\nzsu7waaq9r/+ihlNT/PJuCPwwW0uyp8XytDMhAVFOfE37cElqOap0x1HgZ5LgNO7\nB2Xn3sgNVpgKdBRIqNQW3DtOK/ZsmI8nY6rmUya+Tt7L85PEnyo8JOpaZ+DuPTIM\nF1F3sHMM1pfm9SAiEcyYsTDbDKCvPBM6GlqZcJVWqasT8IVICQ+ph3nZkGfrJWmM\nxjnKtUHlAgMBAAECggEACH2pTofAL/dmcKMqWgBSYRRLi9HpxgwrNKVeYR2/ZMAX\nKYM7AIKHaSFf2/GugoRRvXqfsnaenNvzkyEe/IHyG7SB0o7nW1wX4zWH6VoLjJeM\nDer9z88cEtIlnkrjqxGY6VjwaJonlT7pQzK5rjTj1zYMvn2InuF8hCYQrePt4yFV\nwzWM3ftFTEweOdK+ILbb6EqOWjb2hDqef/izcDyHha5Ni1lAojbFHiNwc54Sg6qQ\n2TEKYlMH5+48GRgt7G6YLSTxqTp3O2wp9T/8fLN6gYdlXdDjV0r+JQ5vtU56V2UV\nQWcO5tuKlss3h3/rMkt3IUTgqSz+q0aeoDe9XdcDuQKBgQDtWjI8/MXo8GwJP/wh\n25DjeOIi0T3Yaoj9psqUS6tnLWfM6EppduKvQcqoZ8dwRKx/NquMDlmscXBVL1fx\nxgZnLr8ra8Qlmf7hOeGKxuNUslnCGJfB52Y6fZCs3vSeo4u4cIq/zRtBLfamuA7V\nC9VXKLQSw1rfe0UQI8/kpCXrKQKBgQDQ738oMNb1C9ibDqJ7ZpzkWaoMsx6NiAuq\nvp0xiW3mErk8TOBB8ABLNLehaAcwxEXv1bJQSWSGiQL8AqsX3a5EVZwYfuN/3gto\n+POqkmo5J7ie4+qGabHpPpipI+uojWwbM+GFnEBn0Rz6zc8p/S5QQD52X4wO94Dx\nIjqkS6a0XQKBgQCtlQ4yrgYrMlFAfovtUv9mbIytO+uH73naT3XN+H0VCw7ju2pY\nMPrdgzcr7CHeSEsDCj9xQTlxtNCba/FcPx+FrJlgrwKXIUVXABajgIrW8UxVd9jc\nlVedJSF+W9v4fND9BUljtiPdijjderRWOL5AbOMs6bP2xtceU6KBq06T6QKBgQCi\nuyaqwv9pdISMoGVk/5MLN9r+cTRGv8N2hWghgQybudGUabvxH2DbMoAjssaG8RgX\nqLVtWvx03Jn6domT2RE2IAen/IxstyDj7aK7I7agNZPSDWpIrmHnbN2yP0v4x81/\nknUAf6aaNYEAxvOnnI5J6v+7asfHkHZZWXObK2D38QKBgDVJbEHsEkrJ0RoSL49O\nIrjVxgg1tUO0/w/1cHgKZk72JrnikChs+FtMCTYlGkfuD+Pk2W0kgbiPaiEbkOw8\nTEcycVZyBUJbBfdX5sy1iL9fVOJkX66oAMaZTMsO8B+bjjhnvu37H/ak2pOhi/57\n3agHUrf3FUeVLY+lEDqNv6uM\n-----END PRIVATE KEY-----\n',
  client_email: 'firebase-adminsdk-2z6hl@yori-d3f4e.iam.gserviceaccount.com',
  client_id: '107201071119121767897',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-2z6hl%40yori-d3f4e.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};
const imageBaseUrl = 'https://storage.cloud.google.com/';
export default {
  jwtSecret: jwtSecretKey,
  mongoUrl,
  port,
  firebaseKey,
  imageBaseUrl,
};
