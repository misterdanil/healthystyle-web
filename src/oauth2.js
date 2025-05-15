import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

const checkAuth = async (optUri, method, fetchRedirectUri, cacheUri, searchParams) => {  
  console.log(searchParams.get('access_token'));
  if(searchParams.get('access_token') != null) {
      Cookies.set('access_token', searchParams.get('access_token'));
      Cookies.set('refresh_token', searchParams.get('refresh_token'));
    }
    var config = {};
    if(Cookies.get('access_token') != null) {
      config = {Authorization: "Bearer " + Cookies.get("access_token"), 'Access-Control-Allow-Origin': 'http://localhost:3000'}
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

  export {checkAuth}