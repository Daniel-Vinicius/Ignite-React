# Next Auth

### Interceptor no Axios

```ts
/* api.interceptors.response é quando você quer interceptar uma chamada a API depois dela sair do backend e antes dela chegar no frontend.
   api.interceptors.request é quando você quer interceptar uma chamada a API antes dela chegar ao backend.

   Seja api.interceptors.request ou .response os dois tem um método chamado .use que recebe dois parâmetros, que são funções (SEM ASYNC AWAIT), a primeira função recebe a response caso seja api.interceptors.response ou request caso seja api.interceptors.request, e basicamente é chamada quando não há erro.

   A segunda função recebe um erro e é chamada quando há um erro.
*/

import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";
import { signOut } from "../contexts/AuthContext";

let cookies = parseCookies();
let isRefreshing = false;

/* Array que guarda UM objeto onde dentro desse UM objeto há alguma dessas duas funções onSuccess e onFailure
   onSuccess recebe um token como parâmetro, atualiza o header Authorization da const api, e no final refaz a chamada ao backend.
   onFailure recebe um erro e só o rejeita
*/

let failedRequestQueue = [];

export const api = axios.create({
  baseURL: "http://localhost:3333",
  // Colocando o token no header Authorization globalmente via cookies
  headers: {
    Authorization: `Bearer ${cookies["nextauth.token"]}`,
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response.status === 401) {
      // "token.expired" é um código que o backend retorna pra mim saber que o erro foi de expiração de token.
      if (error.response.data?.code === "token.expired") {
        // atualizando a variável cookies pois lá em cima ela pega os cookies na renderização da página aqui o valor retornado da função
        // parseCookies são do momento em que houve a expiração do token.
        cookies = parseCookies();

        const { "nextauth.refreshToken": refreshToken } = cookies;
        // error.config é toda a configuração da request, os parâmetros, headers, tudo.
        const originalConfig = error.config;

        if (!isRefreshing) {
          isRefreshing = true;

          api
            .post("/refresh", {
              refreshToken,
            })
            .then((response) => {
              const { token } = response.data;

              /* setCookie --
              O primeiro parâmetro de setCookie é o contexto do cookie, usado para recuperar o cookie no server-side, api routes, sempre em que
              NÃO ESTIVERMOS em API ROUTES ou ambiente server side devemos colocar como undefined, o segundo é o nome do cookie que será retornado da função parseCookies e o terceiro o valor do cookie, depois temos o quarto parâmetro que é opcional, nele definimos opções como quando o cookie vai sumir "maxAge" e quais rotas da aplicação tem acesso a ele no caso "path" o valor "/" em "path" defini que a aplicação toda tem acesso a esse cookie.
              */
              setCookie(undefined, "nextauth.token", token, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: "/",
              });

              setCookie(
                undefined,
                "nextauth.refreshToken",
                response.data.refreshToken,
                {
                  maxAge: 60 * 60 * 24 * 30, // 30 days
                  path: "/",
                }
              );

              // Atualizando o header Authorization com o novo token
              api.defaults.headers["Authorization"] = `Bearer ${token}`;

              // Chamando a funcção onSuccess e passando o token
              failedRequestQueue.forEach((request) => request.onSuccess(token));
              // Limpando o failedRequestQueue
              failedRequestQueue = [];
            })
            .catch((err) => {
              // Chamando a funcção onFailure e passando o error
              failedRequestQueue.forEach((request) => request.onFailure(err));
              // Limpando o failedRequestQueue
              failedRequestQueue = [];
            })
            // Depois que tudo termina ".finally" a variável isRefreshing volta a ter o valor false.
            .finally(() => {
              isRefreshing = false;
            });
        }

        return new Promise((resolve, reject) => {
          // Adicionando um objeto no Array de requests falhas
          failedRequestQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers["Authorization"] = `Bearer ${token}`;

              // aqui a todo o código abaixo não é executado caso a chamada a api der certo.
              resolve(api(originalConfig));
            },

            onFailure: (err: AxiosError) => {
              reject(err);
            },
          });
        });
      } else {
        signOut();
      }
    }

    // Retorna a rejeição do erro, basicamente não faz nada, passa o erro pra frente.
    return Promise.reject(error);
  }
);
```
