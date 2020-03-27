import axios from 'axios';
import './app.css';
import nyancat from './nyancat.jpg';
import form from './form';
// import result from './result';

let resultEl;
let formEl;

document.addEventListener('DOMContentLoaded', async () => {
	const res = await axios.get('/api/users');

	console.log(res.data);

	const data = res.data;

	// document.body.innerHTML = `
	// 	<img src="${nyancat}" />		
	// `;

	// document.body.innerHTML = (data || []).map(user => {
	// 	return `<div>${user.id}: ${user.name}</div>`
	// }).join("");

	formEl = document.createElement("div");
	formEl.innerHTML = form.render();
	document.body.appendChild(formEl);

	// 일부 코드에서 import 하는 방법
	// import (/* webpackChunkName: "result" */'./result').then(async m => {
	// 	const result = m.default;

	// 	resultEl = document.createElement("div");
	// 	resultEl.innerHTML = await result.render();
	// 	document.body.appendChild(resultEl);
	// });

	resultEl = document.createElement("div");
	resultEl.innerHTML = await result.render();
	document.body.appendChild(resultEl);
});

if (module.hot){
	console.log('핫 모듈 켜짐');

	module.hot.accept('./result', async () => {
		console.log('result 모듈 변경됨');
		resultEl.innerHTML = await result.render();
	});

	module.hot.accept('./form', () => {
		console.log('form 모듈 변경됨');
		formEl.innerHTML = form.render();
	});
}


console.log(process.env.NODE_ENV);
console.log(TWO);
console.log(api.domain);


