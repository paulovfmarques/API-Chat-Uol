<h1 align="center">
<br>  
<br>
<br>
API Chat Uol
</h1>

<p align="center">A simple API for a chat platform</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License MIT">
  </a>
</p>

## Features
[//]: # (Add the features of your project here:)
This API features the following tecnology:

- 💹 **Node Js** — A web framework for Node Js

## Getting started

Move yourself to the project directory:

1. Run <strong>npm install</strong>;
2. Run <strong>node servidor.js</strong>;
3. Open http://localhost:3000/:route on your browser, if you'd like to see any specific route;
4. Use https://www.postman.com/ to be able to GET/POST on any given route;

<strong>Routes:</strong>

/participants:
<br>
--POST: expects a {name} object;
<br>
--GET:expects nothing.
<br>

/messages:
<br>
--POST: expects { from, to, text, type }, being the type a "message", "private_message" or "status";
<br>
--GET: requires a headers with {"user-name"}, the value being the user logged onto the chat;
<br>
  
/status:
<br>
--POST: expects a {name} object;
<br>


## License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/licenses/MIT) page for details.
