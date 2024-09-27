// cred - https://blog.couchdb.org/2018/02/03/couchdb-authentication-without-server-side-code/

const form = document.getElementById("loginForm")

form.addEventListener("submit", (e) => {
	e.preventDefault()
	const data = { name: username.value, password: password.value }
	output.innerText = ""
	fetch("https://chao-db.tawtaw.site/_session", {
		method: "POST",
		credentials: "include",
		headers: {
			"content-type": "application/json",
			authorization: `Basic ${btoa(data.name + ":" + data.password)}`,
		},
		body: JSON.stringify(data),
	})
		.then((res) => res.text())
		.then((res) => (output.innerText = res))
})

{
	/* 
<form id="loginForm">
  <input id="username" placeholder="name" />
  <input id="password" placeholder="password" type="password" />
  <button type="submit">LOGIN!</button>
  <p id="output"></p>

  <a href="/_utils">Go to Project Fauxton</a>
</form> 
*/
}
