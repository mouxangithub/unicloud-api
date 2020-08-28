"use strict";
class FormData {
	constructor() {
		this._boundary = "------FormDataBaseBoundary" + Math.random().toString(36).substring(2), this.dataList = []
	}
	_addData(e) {
		const t = this.dataList[this.dataList.length - 1];
		"string" == typeof e && "string" == typeof t ? this.dataList[this.dataList.length - 1] = t + "\r\n" + e : this.dataList
			.push(e)
	}
	append(e, t, a) {
		this._addData("--" + this._boundary);
		let n = `Content-Disposition: form-data; name="${e}"`;
		switch (Buffer.isBuffer(t)) {
			case !0:
				if (!a.filename || !a.contentType) throw new Error("filename and contentType required");
				n += `; filename="${a.filename}"`, this._addData(n), this._addData(`Content-Type: ${a.contentType}`), this._addData(
					""), this._addData(t);
				break;
			default:
				this._addData(""), this._addData(t)
		}
	}
	getHeaders(e) {
		const t = {
			"Content-Type": "multipart/form-data; boundary=" + this._boundary
		};
		return Object.assign(t, e)
	}
	getBuffer() {
		let e = Buffer.alloc(0);
		return this.dataList.forEach(t => {
			e = Buffer.isBuffer(t) ? Buffer.concat([e, t]) : Buffer.concat([e, Buffer.from("" + t)]), e = Buffer.concat([e,
				Buffer.from("\r\n")
			])
		}), e = Buffer.concat([e, Buffer.from("--" + this._boundary + "--")]), e
	}
}
class UniCloudError extends Error {
	constructor(e) {
		super(e.message), this.errMsg = e.message || "", Object.defineProperties(this, {
			message: {
				get() {
					return `errCode: ${e.code||""} | errMsg: ` + this.errMsg
				},
				set(e) {
					this.errMsg = e
				}
			}
		})
	}
}
const _toString = Object.prototype.toString,
	hasOwnProperty = Object.prototype.hasOwnProperty;

function hasOwn(e, t) {
	return hasOwnProperty.call(e, t)
}

function isPlainObject(e) {
	return "[object Object]" === _toString.call(e)
}

function isFn(e) {
	return "function" == typeof e
}
const mime2ext = {
	"image/png": "png",
	"image/jpeg": "jpg",
	"image/gif": "gif",
	"image/svg+xml": "svg",
	"image/bmp": "bmp",
	"image/webp": "webp"
};

function getExtension(e) {
	return mime2ext[e]
}
const isSnakeCase = /_(\w)/g,
	isCamelCase = /[A-Z]/g;

function snake2camel(e) {
	return e.replace(isSnakeCase, (e, t) => t ? t.toUpperCase() : "")
}

function camel2snake(e) {
	return e.replace(isCamelCase, e => "_" + e.toLowerCase())
}

function parseObjectKeys(e, t) {
	let a, n;
	switch (t) {
		case "snake2camel":
			n = snake2camel, a = isSnakeCase;
			break;
		case "camel2snake":
			n = camel2snake, a = isCamelCase
	}
	for (const s in e)
		if (hasOwn(e, s) && a.test(s)) {
			const a = n(s);
			e[a] = e[s], delete e[s], isPlainObject(e[a]) ? e[a] = parseObjectKeys(e[a], t) : Array.isArray(e[a]) && (e[a] = e[a]
				.map(e => parseObjectKeys(e, t)))
		} return e
}

function snake2camelJson(e) {
	return parseObjectKeys(e, "snake2camel")
}

function camel2snakeJson(e) {
	return parseObjectKeys(e, "camel2snake")
}

function parseParams(e = {}, t) {
	if (!t || !e) return e;
	const a = ["_pre", "_purify", "_post"];
	t._pre && (e = t._pre(e));
	let n = {
		shouldDelete: new Set([])
	};
	if (t._purify) {
		const e = t._purify;
		for (const t in e) e[t] = new Set(e[t]);
		n = Object.assign(n, e)
	}
	if (isPlainObject(t))
		for (const s in t) {
			const i = t[s];
			isFn(i) && -1 === a.indexOf(s) ? e[s] = i(e) : "string" == typeof i && -1 === a.indexOf(s) && (e[s] = e[i], n.shouldDelete
				.add(i))
		} else isFn(t) && (e = t(e));
	if (n.shouldDelete)
		for (const t of n.shouldDelete) delete e[t];
	return t._post && (e = t._post(e)), e
}

function createApi(e, t) {
	const a = new e(t);
	return new Proxy(a, {
		get: function(e, t) {
			if ("function" == typeof e[t] && 0 !== t.indexOf("_") && e._protocols && e._protocols[t]) {
				const a = e._protocols[t];
				return async function(n) {
					n = parseParams(n, a.args);
					let s = await e[t](n);
					return s = parseParams(s, a.returnValue), s
				}
			}
			return e[t]
		}
	})
}

function generateApiResult(e, t) {
	if (t.errcode) throw new UniCloudError({
		code: t.errcode || -2,
		message: t.errmsg || `${e} fail`
	});
	return delete t.errcode, delete t.errmsg, { ...t,
		errMsg: `${e} ok`,
		errCode: 0
	}
}

function nomalizeError(e, t) {
	throw new UniCloudError({
		code: t.code || -2,
		message: t.message || `${e} fail`
	})
}
async function callWxOpenApi({
	name: e,
	url: t,
	data: a,
	options: n,
	defaultOptions: s
}) {
	let i = {};
	const o = camel2snakeJson(Object.assign({}, a));
	o && o.access_token && delete o.access_token;
	try {
		n = Object.assign({}, s, n, {
			data: o
		}), i = await uniCloud.httpclient.request(t, n)
	} catch (t) {
		return nomalizeError(e, t)
	}
	let r = i.data;
	const c = i.headers["content-type"];
	if (!Buffer.isBuffer(r) || 0 !== c.indexOf("text/plain") && 0 !== c.indexOf("application/json")) Buffer.isBuffer(r) &&
		(r = {
			buffer: r,
			contentType: c
		});
	else try {
		r = JSON.parse(r.toString())
	} catch (e) {
		r = r.toString()
	}
	return snake2camelJson(generateApiResult(e, r || {
		errCode: -2,
		errMsg: "Request failed"
	}))
}

function buildUrl(e, t) {
	let a = "";
	if (t && t.accessToken) {
		a = `${e.indexOf("?")>-1?"&":"?"}access_token=${t.accessToken}`
	}
	return `${e}${a}`
}
class Auth {
	constructor(e) {
		this.options = Object.assign({
			baseUrl: "https://api.weixin.qq.com",
			timeout: 5e3
		}, e)
	}
	async _requestWxOpenapi({
		name: e,
		url: t,
		data: a,
		options: n
	}) {
		const s = {
			method: "GET",
			dataType: "json",
			dataAsQueryString: !0,
			timeout: this.options.timeout
		};
		return await callWxOpenApi({
			name: `auth.${e}`,
			url: `${this.options.baseUrl}${buildUrl(t,a)}`,
			data: a,
			options: n,
			defaultOptions: s
		})
	}
	async getPaidUnionId(e) {
		return await this._requestWxOpenapi({
			name: "getPaidUnionId",
			url: "/wxa/getpaidunionid",
			data: e
		})
	}
	async getAccessToken() {
		return await this._requestWxOpenapi({
			name: "getAccessToken",
			url: "/cgi-bin/token",
			data: {
				grant_type: "client_credential",
				appid: this.options.appId,
				secret: this.options.secret
			}
		})
	}
}
class CustomerServiceMessage {
	constructor(e) {
		this.options = Object.assign({
			baseUrl: "https://api.weixin.qq.com",
			timeout: 5e3
		}, e)
	}
	async _requestWxOpenapi({
		name: e,
		url: t,
		data: a,
		options: n
	}) {
		a.accessToken = a.accessToken || this.options.accessToken;
		const s = {
			method: "POST",
			dataType: "json",
			contentType: "json",
			timeout: this.options.timeout
		};
		return await callWxOpenApi({
			name: `customerServiceMessage.${e}`,
			url: `${this.options.baseUrl}${buildUrl(t,a)}`,
			data: a,
			options: n,
			defaultOptions: s
		})
	}
	async uploadTempMedia(e) {
		const t = `/cgi-bin/media/upload?type=${e.type||"image"}`,
			a = new FormData,
			n = e.media;
		return a.append("media", n.value, {
			filename: `${Date.now()}.` + getExtension(n.contentType) || "png",
			contentType: n.contentType
		}), await this._requestWxOpenapi({
			name: "uploadTempMedia",
			url: t,
			data: {
				accessToken: e.accessToken
			},
			options: {
				content: a.getBuffer(),
				headers: a.getHeaders()
			}
		})
	}
	async getTempMedia(e) {
		const t = `/cgi-bin/media/get?media_id=${e.mediaId}`;
		return await this._requestWxOpenapi({
			name: "getTempMedia",
			url: t,
			data: {
				accessToken: e.accessToken
			},
			options: {
				method: "GET",
				dataType: ""
			}
		})
	}
	async send(e) {
		return await this._requestWxOpenapi({
			name: "send",
			url: "/cgi-bin/message/custom/send",
			data: e
		})
	}
}
class Wxacode {
	constructor(e) {
		this.options = Object.assign({
			baseUrl: "https://api.weixin.qq.com",
			timeout: 5e3
		}, e)
	}
	async _requestWxOpenapi({
		name: e,
		url: t,
		data: a,
		options: n
	}) {
		a.accessToken = a.accessToken || this.options.accessToken;
		const s = {
			method: "POST",
			dataType: "buffer",
			contentType: "json",
			timeout: this.options.timeout
		};
		return await callWxOpenApi({
			name: `wxacode.${e}`,
			url: `${this.options.baseUrl}${buildUrl(t,a)}`,
			data: a,
			options: n,
			defaultOptions: s
		})
	}
	async createQRCode(e) {
		return await this._requestWxOpenapi({
			name: "createQRCode",
			url: "/cgi-bin/wxaapp/createwxaqrcode",
			data: e
		})
	}
	async get(e) {
		return await this._requestWxOpenapi({
			name: "get",
			url: "/wxa/getwxacode",
			data: e
		})
	}
	async getUnlimited(e) {
		return await this._requestWxOpenapi({
			name: "getUnlimited",
			url: "/wxa/getwxacodeunlimit",
			data: e
		})
	}
}

function parseImageData(e, t) {
	let a = {};
	const {
		img: n,
		imgUrl: s,
		accessToken: i
	} = e;
	if (n) {
		const e = new FormData;
		e.append("img", n.value, {
			filename: `${Date.now()}.` + getExtension(n.contentType) || "png",
			contentType: n.contentType
		}), a = {
			content: e.getBuffer(),
			headers: e.getHeaders()
		}
	}
	if (s) {
		const e = t.indexOf("?") > -1 ? "&" : "?";
		t += `${e}img_url=${encodeURIComponent(s)}`
	}
	return {
		url: t,
		data: {
			accessToken: i
		},
		options: a
	}
}
class Img {
	constructor(e) {
		this.options = Object.assign({
			baseUrl: "https://api.weixin.qq.com",
			timeout: 5e3
		}, e)
	}
	async _requestWxOpenapi({
		name: e,
		url: t,
		data: a,
		options: n
	}) {
		a.accessToken = a.accessToken || this.options.accessToken;
		const s = {
			method: "POST",
			dataType: "json",
			contentType: "json",
			timeout: this.options.timeout
		};
		return await callWxOpenApi({
			name: `img.${e}`,
			url: `${this.options.baseUrl}${buildUrl(t,a)}`,
			data: a,
			options: n,
			defaultOptions: s
		})
	}
	async aiCrop(e) {
		return await this._requestWxOpenapi({
			name: "aiCrop",
			...parseImageData(e, "/cv/img/aicrop")
		})
	}
	async scanQRCode(e) {
		return await this._requestWxOpenapi({
			name: "scanQRCode",
			...parseImageData(e, "/cv/img/qrcode")
		})
	}
	async superresolution(e) {
		return await this._requestWxOpenapi({
			name: "superresolution",
			...parseImageData(e, "/cv/img/superresolution")
		})
	}
}
class WxApi {
	constructor(e) {
		this.options = Object.assign({}, {
			baseUrl: "https://api.weixin.qq.com",
			timeout: 5e3
		}, e), this.auth = createApi(Auth, this.options), this.customerServiceMessage = createApi(CustomerServiceMessage,
			this.options), this.wxacode = createApi(Wxacode, this.options), this.img = createApi(Img, this.options)
	}
}
var index = {
	initWeixin: function(e = {}) {
		return e.clientType = e.clientType || __ctx__.PLATFORM, new WxApi(e)
	}
};
module.exports = index;
