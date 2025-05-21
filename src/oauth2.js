import { v4 as uuidv4 } from 'uuid';
import Cookies from 'universal-cookie';

const checkAuth = async (optUri, method, fetchRedirectUri, refreshTokenUri, cacheUri, searchParams) => {  
  console.log(searchParams.get('access_token'));
  const cookies = new Cookies();
  if(searchParams.get('access_token') != null) {
    const expiredDate = new Date();
    const expires = Number(searchParams.get('expires'));
    expiredDate.setSeconds(expiredDate.getSeconds() + expires);
    cookies.set('access_token', searchParams.get('access_token'), {path: '/', expires: expiredDate});
    cookies.set('refresh_token', searchParams.get('refresh_token'));
  }
    var config = {};
    const accessToken = cookies.get('access_token');
    const refreshToken = cookies.get('refresh_token');
    if(accessToken != null) {
      config = {Authorization: "Bearer " + accessToken, 'Access-Control-Allow-Origin': 'http://localhost:3000'}
    }
    else if(refreshToken != null) {
      const res = await fetch(refreshTokenUri + "?refresh_token=" + refreshToken);
      if(res.status == 400) {
        cookies.remove('refresh_token');
      }
      else if(res.status == 200) {
        const response = await res.json();
        console.log(response);
        const expiredDate = new Date();
        const expires = Number(response.expires);
        expiredDate.setSeconds(expiredDate.getSeconds() + expires);
        cookies.set('access_token', response.access_token, {path: '/', expires: expiredDate});
        cookies.set('refresh_token', response.refresh_token);
        return;
    }
  }

  if(optUri == null) {
    return;
  }
    config['Access-Control-Request-Method'] = method;
    let res = await fetch(optUri, {
      credentials: "include",
      method: "OPTIONS",
      headers: config
    });
    if(res.status == 401) {
      res = await fetch(fetchRedirectUri + "?cachedUri=" + cacheUri + "&state=" + uuidv4(), {
        credentials: "include"
      })
      const redirectUri = await res.text();
      window.location.replace(redirectUri);
      // res = await fetch(redirectUri, {
      //   credentials: "include", // обязательное поле!
      // });
      // if(res.status == 401) {
        // navigate('/auth');
      // }
      // window.location.replace('http://localhost:3002/auth');
    }
    // const data = await res.json();
    // console.log(data);
    // if(data == 'false') {
    //   navigate('/auth')
    // }
  }

  const isAuthenticated = () => {
    const cookies = new Cookies();
    return cookies.get('access_token') != null;
  }

  const logout = () => {
    const cookies = new Cookies();
    console.log('deleting');
    cookies.remove('access_token');
    cookies.remove('refresh_token');
  }

  export {checkAuth, isAuthenticated, logout}