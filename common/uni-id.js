"use strict";
/**
 * 此函数为Uni-id云函数
 * 使用方法详情观看官方文档： https://uniapp.dcloud.io/uniCloud/uni-id
 */

function e(e) {
	return e && "object" == typeof e && "default" in e ? e.default : e
}
var t = e(require("crypto")),
	r = e(require("fs")),
	n = e(require("path")),
	o = e(require("buffer")),
	i = e(require("stream")),
	s = e(require("util")),
	a = e(require("querystring"));
class c extends Error {
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
const u = Object.prototype.toString,
	f = Object.prototype.hasOwnProperty;

function p(e, t) {
	return f.call(e, t)
}

function l(e) {
	return "[object Object]" === u.call(e)
}

function d(e) {
	return "function" == typeof e
}
const h = /_(\w)/g,
	m = /[A-Z]/g;

function g(e) {
	return e.replace(h, (e, t) => t ? t.toUpperCase() : "")
}

function y(e) {
	return e.replace(m, e => "_" + e.toLowerCase())
}

function w(e, t) {
	let r, n;
	switch (t) {
		case "snake2camel":
			n = g, r = h;
			break;
		case "camel2snake":
			n = y, r = m
	}
	for (const o in e)
		if (p(e, o) && r.test(o)) {
			const r = n(o);
			e[r] = e[o], delete e[o], l(e[r]) ? e[r] = w(e[r], t) : Array.isArray(e[r]) && (e[r] = e[r].map(e => w(e, t)))
		} return e
}

function v(e) {
	return w(e, "snake2camel")
}

function b(e) {
	return w(e, "camel2snake")
}

function S(e) {
	return function(e, t = "-") {
		e = e || new Date;
		const r = [];
		return r.push(e.getFullYear()), r.push(("00" + (e.getMonth() + 1)).substr(-2)), r.push(("00" + e.getDate()).substr(-
			2)), r.join(t)
	}(e = e || new Date) + " " + function(e, t = ":") {
		e = e || new Date;
		const r = [];
		return r.push(("00" + e.getHours()).substr(-2)), r.push(("00" + e.getMinutes()).substr(-2)), r.push(("00" + e.getSeconds())
			.substr(-2)), r.join(t)
	}(e)
}

function _() {
	"development" === process.env.NODE_ENV && console.log(...arguments)
}

function E(e = {}, t) {
	if (!t || !e) return e;
	const r = ["_pre", "_purify", "_post"];
	t._pre && (e = t._pre(e));
	let n = {
		shouldDelete: new Set([])
	};
	if (t._purify) {
		const e = t._purify;
		for (const t in e) e[t] = new Set(e[t]);
		n = Object.assign(n, e)
	}
	if (l(t))
		for (const o in t) {
			const i = t[o];
			d(i) && -1 === r.indexOf(o) ? e[o] = i(e) : "string" == typeof i && -1 === r.indexOf(o) && (e[o] = e[i], n.shouldDelete
				.add(i))
		} else d(t) && (e = t(e));
	if (n.shouldDelete)
		for (const t of n.shouldDelete) delete e[t];
	return t._post && (e = t._post(e)), e
}

function x(e, t) {
	const r = new e(t);
	return new Proxy(r, {
		get: function(e, t) {
			if ("function" == typeof e[t] && 0 !== t.indexOf("_") && e._protocols && e._protocols[t]) {
				const r = e._protocols[t];
				return async function(n) {
					n = E(n, r.args);
					let o = await e[t](n);
					return o = E(o, r.returnValue), o
				}
			}
			return e[t]
		}
	})
}

var config = k();
const j = uniCloud.database().collection(config.dbname);

function k() {
	let e = {};
	try {
		e = JSON.parse(r.readFileSync(n.resolve(__dirname, "../config/index.json"))), Object.assign(e, e[__ctx__.PLATFORM])
	} catch (e) {
		throw new Error("请在公用模块uni-id内添加config.json配置必要参数")
	}
	return ["passwordSecret", "tokenSecret", "tokenExpiresIn"].forEach(t => {
		if (!e || !e[t]) throw new Error("请在公用模块uni-id的config.json内添加配置项：" + t)
	}), e
}

function T(e) {
	const r = k(),
		n = t.createHmac("sha1", r.passwordSecret.toString("ascii"));
	return n.update(e), n.digest("hex")
}

function O(e, t) {
	return e(t = {
		exports: {}
	}, t.exports), t.exports
}
var A = O((function(e, t) {
		var r = o.Buffer;

		function n(e, t) {
			for (var r in e) t[r] = e[r]
		}

		function i(e, t, n) {
			return r(e, t, n)
		}
		r.from && r.alloc && r.allocUnsafe && r.allocUnsafeSlow ? e.exports = o : (n(o, t), t.Buffer = i), i.prototype =
			Object.create(r.prototype), n(r, i), i.from = function(e, t, n) {
				if ("number" == typeof e) throw new TypeError("Argument must not be a number");
				return r(e, t, n)
			}, i.alloc = function(e, t, n) {
				if ("number" != typeof e) throw new TypeError("Argument must be a number");
				var o = r(e);
				return void 0 !== t ? "string" == typeof n ? o.fill(t, n) : o.fill(t) : o.fill(0), o
			}, i.allocUnsafe = function(e) {
				if ("number" != typeof e) throw new TypeError("Argument must be a number");
				return r(e)
			}, i.allocUnsafeSlow = function(e) {
				if ("number" != typeof e) throw new TypeError("Argument must be a number");
				return o.SlowBuffer(e)
			}
	})),
	R = (A.Buffer, A.Buffer);

function P(e) {
	if (this.buffer = null, this.writable = !0, this.readable = !0, !e) return this.buffer = R.alloc(0), this;
	if ("function" == typeof e.pipe) return this.buffer = R.alloc(0), e.pipe(this), this;
	if (e.length || "object" == typeof e) return this.buffer = e, this.writable = !1, process.nextTick(function() {
		this.emit("end", e), this.readable = !1, this.emit("close")
	}.bind(this)), this;
	throw new TypeError("Unexpected data type (" + typeof e + ")")
}
s.inherits(P, i), P.prototype.write = function(e) {
	this.buffer = R.concat([this.buffer, R.from(e)]), this.emit("data", e)
}, P.prototype.end = function(e) {
	e && this.write(e), this.emit("end", e), this.emit("close"), this.writable = !1, this.readable = !1
};
var I = P,
	$ = o.Buffer,
	C = o.SlowBuffer,
	N = B;

function B(e, t) {
	if (!$.isBuffer(e) || !$.isBuffer(t)) return !1;
	if (e.length !== t.length) return !1;
	for (var r = 0, n = 0; n < e.length; n++) r |= e[n] ^ t[n];
	return 0 === r
}
B.install = function() {
	$.prototype.equal = C.prototype.equal = function(e) {
		return B(this, e)
	}
};
var D = $.prototype.equal,
	M = C.prototype.equal;

function V(e) {
	return (e / 8 | 0) + (e % 8 == 0 ? 0 : 1)
}
B.restore = function() {
	$.prototype.equal = D, C.prototype.equal = M
};
var q = {
	ES256: V(256),
	ES384: V(384),
	ES512: V(521)
};
var K = function(e) {
		var t = q[e];
		if (t) return t;
		throw new Error('Unknown algorithm "' + e + '"')
	},
	L = A.Buffer;

function H(e) {
	if (L.isBuffer(e)) return e;
	if ("string" == typeof e) return L.from(e, "base64");
	throw new TypeError("ECDSA signature must be a Base64 string or a Buffer")
}

function U(e, t, r) {
	for (var n = 0; t + n < r && 0 === e[t + n];) ++n;
	return e[t + n] >= 128 && --n, n
}
var J = {
		derToJose: function(e, t) {
			e = H(e);
			var r = K(t),
				n = r + 1,
				o = e.length,
				i = 0;
			if (48 !== e[i++]) throw new Error('Could not find expected "seq"');
			var s = e[i++];
			if (129 === s && (s = e[i++]), o - i < s) throw new Error('"seq" specified length of "' + s + '", only "' + (o - i) +
				'" remaining');
			if (2 !== e[i++]) throw new Error('Could not find expected "int" for "r"');
			var a = e[i++];
			if (o - i - 2 < a) throw new Error('"r" specified length of "' + a + '", only "' + (o - i - 2) + '" available');
			if (n < a) throw new Error('"r" specified length of "' + a + '", max of "' + n + '" is acceptable');
			var c = i;
			if (i += a, 2 !== e[i++]) throw new Error('Could not find expected "int" for "s"');
			var u = e[i++];
			if (o - i !== u) throw new Error('"s" specified length of "' + u + '", expected "' + (o - i) + '"');
			if (n < u) throw new Error('"s" specified length of "' + u + '", max of "' + n + '" is acceptable');
			var f = i;
			if ((i += u) !== o) throw new Error('Expected to consume entire buffer, but "' + (o - i) + '" bytes remain');
			var p = r - a,
				l = r - u,
				d = L.allocUnsafe(p + a + l + u);
			for (i = 0; i < p; ++i) d[i] = 0;
			e.copy(d, i, c + Math.max(-p, 0), c + a);
			for (var h = i = r; i < h + l; ++i) d[i] = 0;
			return e.copy(d, i, f + Math.max(-l, 0), f + u), d = (d = d.toString("base64")).replace(/=/g, "").replace(/\+/g,
				"-").replace(/\//g, "_")
		},
		joseToDer: function(e, t) {
			e = H(e);
			var r = K(t),
				n = e.length;
			if (n !== 2 * r) throw new TypeError('"' + t + '" signatures must be "' + 2 * r + '" bytes, saw "' + n + '"');
			var o = U(e, 0, r),
				i = U(e, r, e.length),
				s = r - o,
				a = r - i,
				c = 2 + s + 1 + 1 + a,
				u = c < 128,
				f = L.allocUnsafe((u ? 2 : 3) + c),
				p = 0;
			return f[p++] = 48, u ? f[p++] = c : (f[p++] = 129, f[p++] = 255 & c), f[p++] = 2, f[p++] = s, o < 0 ? (f[p++] = 0,
					p += e.copy(f, p, 0, r)) : p += e.copy(f, p, o, r), f[p++] = 2, f[p++] = a, i < 0 ? (f[p++] = 0, e.copy(f, p, r)) :
				e.copy(f, p, r + i), f
		}
	},
	F = A.Buffer,
	G = "secret must be a string or buffer",
	z = "key must be a string or a buffer",
	W = "function" == typeof t.createPublicKey;

function Z(e) {
	if (!F.isBuffer(e) && "string" != typeof e) {
		if (!W) throw ee(z);
		if ("object" != typeof e) throw ee(z);
		if ("string" != typeof e.type) throw ee(z);
		if ("string" != typeof e.asymmetricKeyType) throw ee(z);
		if ("function" != typeof e.export) throw ee(z)
	}
}

function Y(e) {
	if (!F.isBuffer(e) && "string" != typeof e && "object" != typeof e) throw ee(
		"key must be a string, a buffer or an object")
}

function X(e) {
	return e.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
}

function Q(e) {
	var t = 4 - (e = e.toString()).length % 4;
	if (4 !== t)
		for (var r = 0; r < t; ++r) e += "=";
	return e.replace(/\-/g, "+").replace(/_/g, "/")
}

function ee(e) {
	var t = [].slice.call(arguments, 1),
		r = s.format.bind(s, e).apply(null, t);
	return new TypeError(r)
}

function te(e) {
	var t;
	return t = e, F.isBuffer(t) || "string" == typeof t || (e = JSON.stringify(e)), e
}

function re(e) {
	return function(r, n) {
		! function(e) {
			if (!F.isBuffer(e)) {
				if ("string" == typeof e) return e;
				if (!W) throw ee(G);
				if ("object" != typeof e) throw ee(G);
				if ("secret" !== e.type) throw ee(G);
				if ("function" != typeof e.export) throw ee(G)
			}
		}(n), r = te(r);
		var o = t.createHmac("sha" + e, n);
		return X((o.update(r), o.digest("base64")))
	}
}

function ne(e) {
	return function(t, r, n) {
		var o = re(e)(t, n);
		return N(F.from(r), F.from(o))
	}
}

function oe(e) {
	return function(r, n) {
		Y(n), r = te(r);
		var o = t.createSign("RSA-SHA" + e);
		return X((o.update(r), o.sign(n, "base64")))
	}
}

function ie(e) {
	return function(r, n, o) {
		Z(o), r = te(r), n = Q(n);
		var i = t.createVerify("RSA-SHA" + e);
		return i.update(r), i.verify(o, n, "base64")
	}
}

function se(e) {
	return function(r, n) {
		Y(n), r = te(r);
		var o = t.createSign("RSA-SHA" + e);
		return X((o.update(r), o.sign({
			key: n,
			padding: t.constants.RSA_PKCS1_PSS_PADDING,
			saltLength: t.constants.RSA_PSS_SALTLEN_DIGEST
		}, "base64")))
	}
}

function ae(e) {
	return function(r, n, o) {
		Z(o), r = te(r), n = Q(n);
		var i = t.createVerify("RSA-SHA" + e);
		return i.update(r), i.verify({
			key: o,
			padding: t.constants.RSA_PKCS1_PSS_PADDING,
			saltLength: t.constants.RSA_PSS_SALTLEN_DIGEST
		}, n, "base64")
	}
}

function ce(e) {
	var t = oe(e);
	return function() {
		var r = t.apply(null, arguments);
		return r = J.derToJose(r, "ES" + e)
	}
}

function ue(e) {
	var t = ie(e);
	return function(r, n, o) {
		return n = J.joseToDer(n, "ES" + e).toString("base64"), t(r, n, o)
	}
}

function fe() {
	return function() {
		return ""
	}
}

function pe() {
	return function(e, t) {
		return "" === t
	}
}
W && (z += " or a KeyObject", G += "or a KeyObject");
var le = function(e) {
		var t = {
				hs: re,
				rs: oe,
				ps: se,
				es: ce,
				none: fe
			},
			r = {
				hs: ne,
				rs: ie,
				ps: ae,
				es: ue,
				none: pe
			},
			n = e.match(/^(RS|PS|ES|HS)(256|384|512)$|^(none)$/i);
		if (!n) throw ee(
			'"%s" is not a valid algorithm.\n  Supported algorithms are:\n  "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512" and "none".',
			e);
		var o = (n[1] || n[3]).toLowerCase(),
			i = n[2];
		return {
			sign: t[o](i),
			verify: r[o](i)
		}
	},
	de = o.Buffer,
	he = function(e) {
		return "string" == typeof e ? e : "number" == typeof e || de.isBuffer(e) ? e.toString() : JSON.stringify(e)
	},
	me = A.Buffer;

function ge(e, t) {
	return me.from(e, t).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
}

function ye(e) {
	var t = e.header,
		r = e.payload,
		n = e.secret || e.privateKey,
		o = e.encoding,
		i = le(t.alg),
		a = function(e, t, r) {
			r = r || "utf8";
			var n = ge(he(e), "binary"),
				o = ge(he(t), r);
			return s.format("%s.%s", n, o)
		}(t, r, o),
		c = i.sign(a, n);
	return s.format("%s.%s", a, c)
}

function we(e) {
	var t = e.secret || e.privateKey || e.key,
		r = new I(t);
	this.readable = !0, this.header = e.header, this.encoding = e.encoding, this.secret = this.privateKey = this.key = r,
		this.payload = new I(e.payload), this.secret.once("close", function() {
			!this.payload.writable && this.readable && this.sign()
		}.bind(this)), this.payload.once("close", function() {
			!this.secret.writable && this.readable && this.sign()
		}.bind(this))
}
s.inherits(we, i), we.prototype.sign = function() {
	try {
		var e = ye({
			header: this.header,
			payload: this.payload.buffer,
			secret: this.secret.buffer,
			encoding: this.encoding
		});
		return this.emit("done", e), this.emit("data", e), this.emit("end"), this.readable = !1, e
	} catch (e) {
		this.readable = !1, this.emit("error", e), this.emit("close")
	}
}, we.sign = ye;
var ve = we,
	be = A.Buffer,
	Se = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

function _e(e) {
	if (function(e) {
			return "[object Object]" === Object.prototype.toString.call(e)
		}(e)) return e;
	try {
		return JSON.parse(e)
	} catch (e) {
		return
	}
}

function Ee(e) {
	var t = e.split(".", 1)[0];
	return _e(be.from(t, "base64").toString("binary"))
}

function xe(e) {
	return e.split(".")[2]
}

function je(e) {
	return Se.test(e) && !!Ee(e)
}

function ke(e, t, r) {
	if (!t) {
		var n = new Error("Missing algorithm parameter for jws.verify");
		throw n.code = "MISSING_ALGORITHM", n
	}
	var o = xe(e = he(e)),
		i = function(e) {
			return e.split(".", 2).join(".")
		}(e);
	return le(t).verify(i, o, r)
}

function Te(e, t) {
	if (t = t || {}, !je(e = he(e))) return null;
	var r = Ee(e);
	if (!r) return null;
	var n = function(e, t) {
		t = t || "utf8";
		var r = e.split(".")[1];
		return be.from(r, "base64").toString(t)
	}(e);
	return ("JWT" === r.typ || t.json) && (n = JSON.parse(n, t.encoding)), {
		header: r,
		payload: n,
		signature: xe(e)
	}
}

function Oe(e) {
	var t = (e = e || {}).secret || e.publicKey || e.key,
		r = new I(t);
	this.readable = !0, this.algorithm = e.algorithm, this.encoding = e.encoding, this.secret = this.publicKey = this.key =
		r, this.signature = new I(e.signature), this.secret.once("close", function() {
			!this.signature.writable && this.readable && this.verify()
		}.bind(this)), this.signature.once("close", function() {
			!this.secret.writable && this.readable && this.verify()
		}.bind(this))
}
s.inherits(Oe, i), Oe.prototype.verify = function() {
	try {
		var e = ke(this.signature.buffer, this.algorithm, this.key.buffer),
			t = Te(this.signature.buffer, this.encoding);
		return this.emit("done", e, t), this.emit("data", e), this.emit("end"), this.readable = !1, e
	} catch (e) {
		this.readable = !1, this.emit("error", e), this.emit("close")
	}
}, Oe.decode = Te, Oe.isValid = je, Oe.verify = ke;
var Ae = Oe,
	Re = {
		ALGORITHMS: ["HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384",
			"ES512"
		],
		sign: ve.sign,
		verify: Ae.verify,
		decode: Ae.decode,
		isValid: Ae.isValid,
		createSign: function(e) {
			return new ve(e)
		},
		createVerify: function(e) {
			return new Ae(e)
		}
	},
	Pe = function(e, t) {
		t = t || {};
		var r = Re.decode(e, t);
		if (!r) return null;
		var n = r.payload;
		if ("string" == typeof n) try {
			var o = JSON.parse(n);
			null !== o && "object" == typeof o && (n = o)
		} catch (e) {}
		return !0 === t.complete ? {
			header: r.header,
			payload: n,
			signature: r.signature
		} : n
	},
	Ie = function(e, t) {
		Error.call(this, e), Error.captureStackTrace && Error.captureStackTrace(this, this.constructor), this.name =
			"JsonWebTokenError", this.message = e, t && (this.inner = t)
	};
(Ie.prototype = Object.create(Error.prototype)).constructor = Ie;
var $e = Ie,
	Ce = function(e, t) {
		$e.call(this, e), this.name = "NotBeforeError", this.date = t
	};
(Ce.prototype = Object.create($e.prototype)).constructor = Ce;
var Ne = Ce,
	Be = function(e, t) {
		$e.call(this, e), this.name = "TokenExpiredError", this.expiredAt = t
	};
(Be.prototype = Object.create($e.prototype)).constructor = Be;
var De = Be,
	Me = 1e3,
	Ve = 60 * Me,
	qe = 60 * Ve,
	Ke = 24 * qe,
	Le = function(e, t) {
		t = t || {};
		var r = typeof e;
		if ("string" === r && e.length > 0) return function(e) {
			if ((e = String(e)).length > 100) return;
			var t =
				/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i
				.exec(e);
			if (!t) return;
			var r = parseFloat(t[1]);
			switch ((t[2] || "ms").toLowerCase()) {
				case "years":
				case "year":
				case "yrs":
				case "yr":
				case "y":
					return 315576e5 * r;
				case "weeks":
				case "week":
				case "w":
					return 6048e5 * r;
				case "days":
				case "day":
				case "d":
					return r * Ke;
				case "hours":
				case "hour":
				case "hrs":
				case "hr":
				case "h":
					return r * qe;
				case "minutes":
				case "minute":
				case "mins":
				case "min":
				case "m":
					return r * Ve;
				case "seconds":
				case "second":
				case "secs":
				case "sec":
				case "s":
					return r * Me;
				case "milliseconds":
				case "millisecond":
				case "msecs":
				case "msec":
				case "ms":
					return r;
				default:
					return
			}
		}(e);
		if ("number" === r && isFinite(e)) return t.long ? function(e) {
			var t = Math.abs(e);
			if (t >= Ke) return He(e, t, Ke, "day");
			if (t >= qe) return He(e, t, qe, "hour");
			if (t >= Ve) return He(e, t, Ve, "minute");
			if (t >= Me) return He(e, t, Me, "second");
			return e + " ms"
		}(e) : function(e) {
			var t = Math.abs(e);
			if (t >= Ke) return Math.round(e / Ke) + "d";
			if (t >= qe) return Math.round(e / qe) + "h";
			if (t >= Ve) return Math.round(e / Ve) + "m";
			if (t >= Me) return Math.round(e / Me) + "s";
			return e + "ms"
		}(e);
		throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(e))
	};

function He(e, t, r, n) {
	var o = t >= 1.5 * r;
	return Math.round(e / r) + " " + n + (o ? "s" : "")
}
var Ue = function(e, t) {
		var r = t || Math.floor(Date.now() / 1e3);
		if ("string" == typeof e) {
			var n = Le(e);
			if (void 0 === n) return;
			return Math.floor(r + n / 1e3)
		}
		return "number" == typeof e ? r + e : void 0
	},
	Je = O((function(e, t) {
		var r;
		t = e.exports = F, r = "object" == typeof process && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(
			process.env.NODE_DEBUG) ? function() {
			var e = Array.prototype.slice.call(arguments, 0);
			e.unshift("SEMVER"), console.log.apply(console, e)
		} : function() {}, t.SEMVER_SPEC_VERSION = "2.0.0";
		var n = Number.MAX_SAFE_INTEGER || 9007199254740991,
			o = t.re = [],
			i = t.src = [],
			s = 0,
			a = s++;
		i[a] = "0|[1-9]\\d*";
		var c = s++;
		i[c] = "[0-9]+";
		var u = s++;
		i[u] = "\\d*[a-zA-Z-][a-zA-Z0-9-]*";
		var f = s++;
		i[f] = "(" + i[a] + ")\\.(" + i[a] + ")\\.(" + i[a] + ")";
		var p = s++;
		i[p] = "(" + i[c] + ")\\.(" + i[c] + ")\\.(" + i[c] + ")";
		var l = s++;
		i[l] = "(?:" + i[a] + "|" + i[u] + ")";
		var d = s++;
		i[d] = "(?:" + i[c] + "|" + i[u] + ")";
		var h = s++;
		i[h] = "(?:-(" + i[l] + "(?:\\." + i[l] + ")*))";
		var m = s++;
		i[m] = "(?:-?(" + i[d] + "(?:\\." + i[d] + ")*))";
		var g = s++;
		i[g] = "[0-9A-Za-z-]+";
		var y = s++;
		i[y] = "(?:\\+(" + i[g] + "(?:\\." + i[g] + ")*))";
		var w = s++,
			v = "v?" + i[f] + i[h] + "?" + i[y] + "?";
		i[w] = "^" + v + "$";
		var b = "[v=\\s]*" + i[p] + i[m] + "?" + i[y] + "?",
			S = s++;
		i[S] = "^" + b + "$";
		var _ = s++;
		i[_] = "((?:<|>)?=?)";
		var E = s++;
		i[E] = i[c] + "|x|X|\\*";
		var x = s++;
		i[x] = i[a] + "|x|X|\\*";
		var j = s++;
		i[j] = "[v=\\s]*(" + i[x] + ")(?:\\.(" + i[x] + ")(?:\\.(" + i[x] + ")(?:" + i[h] + ")?" + i[y] + "?)?)?";
		var k = s++;
		i[k] = "[v=\\s]*(" + i[E] + ")(?:\\.(" + i[E] + ")(?:\\.(" + i[E] + ")(?:" + i[m] + ")?" + i[y] + "?)?)?";
		var T = s++;
		i[T] = "^" + i[_] + "\\s*" + i[j] + "$";
		var O = s++;
		i[O] = "^" + i[_] + "\\s*" + i[k] + "$";
		var A = s++;
		i[A] = "(?:^|[^\\d])(\\d{1,16})(?:\\.(\\d{1,16}))?(?:\\.(\\d{1,16}))?(?:$|[^\\d])";
		var R = s++;
		i[R] = "(?:~>?)";
		var P = s++;
		i[P] = "(\\s*)" + i[R] + "\\s+", o[P] = new RegExp(i[P], "g");
		var I = s++;
		i[I] = "^" + i[R] + i[j] + "$";
		var $ = s++;
		i[$] = "^" + i[R] + i[k] + "$";
		var C = s++;
		i[C] = "(?:\\^)";
		var N = s++;
		i[N] = "(\\s*)" + i[C] + "\\s+", o[N] = new RegExp(i[N], "g");
		var B = s++;
		i[B] = "^" + i[C] + i[j] + "$";
		var D = s++;
		i[D] = "^" + i[C] + i[k] + "$";
		var M = s++;
		i[M] = "^" + i[_] + "\\s*(" + b + ")$|^$";
		var V = s++;
		i[V] = "^" + i[_] + "\\s*(" + v + ")$|^$";
		var q = s++;
		i[q] = "(\\s*)" + i[_] + "\\s*(" + b + "|" + i[j] + ")", o[q] = new RegExp(i[q], "g");
		var K = s++;
		i[K] = "^\\s*(" + i[j] + ")\\s+-\\s+(" + i[j] + ")\\s*$";
		var L = s++;
		i[L] = "^\\s*(" + i[k] + ")\\s+-\\s+(" + i[k] + ")\\s*$";
		var H = s++;
		i[H] = "(<|>)?=?\\s*\\*";
		for (var U = 0; U < 35; U++) r(U, i[U]), o[U] || (o[U] = new RegExp(i[U]));

		function J(e, t) {
			if (t && "object" == typeof t || (t = {
					loose: !!t,
					includePrerelease: !1
				}), e instanceof F) return e;
			if ("string" != typeof e) return null;
			if (e.length > 256) return null;
			if (!(t.loose ? o[S] : o[w]).test(e)) return null;
			try {
				return new F(e, t)
			} catch (e) {
				return null
			}
		}

		function F(e, t) {
			if (t && "object" == typeof t || (t = {
					loose: !!t,
					includePrerelease: !1
				}), e instanceof F) {
				if (e.loose === t.loose) return e;
				e = e.version
			} else if ("string" != typeof e) throw new TypeError("Invalid Version: " + e);
			if (e.length > 256) throw new TypeError("version is longer than 256 characters");
			if (!(this instanceof F)) return new F(e, t);
			r("SemVer", e, t), this.options = t, this.loose = !!t.loose;
			var i = e.trim().match(t.loose ? o[S] : o[w]);
			if (!i) throw new TypeError("Invalid Version: " + e);
			if (this.raw = e, this.major = +i[1], this.minor = +i[2], this.patch = +i[3], this.major > n || this.major < 0)
				throw new TypeError("Invalid major version");
			if (this.minor > n || this.minor < 0) throw new TypeError("Invalid minor version");
			if (this.patch > n || this.patch < 0) throw new TypeError("Invalid patch version");
			i[4] ? this.prerelease = i[4].split(".").map((function(e) {
				if (/^[0-9]+$/.test(e)) {
					var t = +e;
					if (t >= 0 && t < n) return t
				}
				return e
			})) : this.prerelease = [], this.build = i[5] ? i[5].split(".") : [], this.format()
		}
		t.parse = J, t.valid = function(e, t) {
			var r = J(e, t);
			return r ? r.version : null
		}, t.clean = function(e, t) {
			var r = J(e.trim().replace(/^[=v]+/, ""), t);
			return r ? r.version : null
		}, t.SemVer = F, F.prototype.format = function() {
			return this.version = this.major + "." + this.minor + "." + this.patch, this.prerelease.length && (this.version +=
				"-" + this.prerelease.join(".")), this.version
		}, F.prototype.toString = function() {
			return this.version
		}, F.prototype.compare = function(e) {
			return r("SemVer.compare", this.version, this.options, e), e instanceof F || (e = new F(e, this.options)), this.compareMain(
				e) || this.comparePre(e)
		}, F.prototype.compareMain = function(e) {
			return e instanceof F || (e = new F(e, this.options)), z(this.major, e.major) || z(this.minor, e.minor) || z(this
				.patch, e.patch)
		}, F.prototype.comparePre = function(e) {
			if (e instanceof F || (e = new F(e, this.options)), this.prerelease.length && !e.prerelease.length) return -1;
			if (!this.prerelease.length && e.prerelease.length) return 1;
			if (!this.prerelease.length && !e.prerelease.length) return 0;
			var t = 0;
			do {
				var n = this.prerelease[t],
					o = e.prerelease[t];
				if (r("prerelease compare", t, n, o), void 0 === n && void 0 === o) return 0;
				if (void 0 === o) return 1;
				if (void 0 === n) return -1;
				if (n !== o) return z(n, o)
			} while (++t)
		}, F.prototype.inc = function(e, t) {
			switch (e) {
				case "premajor":
					this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", t);
					break;
				case "preminor":
					this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", t);
					break;
				case "prepatch":
					this.prerelease.length = 0, this.inc("patch", t), this.inc("pre", t);
					break;
				case "prerelease":
					0 === this.prerelease.length && this.inc("patch", t), this.inc("pre", t);
					break;
				case "major":
					0 === this.minor && 0 === this.patch && 0 !== this.prerelease.length || this.major++, this.minor = 0, this.patch =
						0, this.prerelease = [];
					break;
				case "minor":
					0 === this.patch && 0 !== this.prerelease.length || this.minor++, this.patch = 0, this.prerelease = [];
					break;
				case "patch":
					0 === this.prerelease.length && this.patch++, this.prerelease = [];
					break;
				case "pre":
					if (0 === this.prerelease.length) this.prerelease = [0];
					else {
						for (var r = this.prerelease.length; --r >= 0;) "number" == typeof this.prerelease[r] && (this.prerelease[r]++,
							r = -2); - 1 === r && this.prerelease.push(0)
					}
					t && (this.prerelease[0] === t ? isNaN(this.prerelease[1]) && (this.prerelease = [t, 0]) : this.prerelease = [t,
						0
					]);
					break;
				default:
					throw new Error("invalid increment argument: " + e)
			}
			return this.format(), this.raw = this.version, this
		}, t.inc = function(e, t, r, n) {
			"string" == typeof r && (n = r, r = void 0);
			try {
				return new F(e, r).inc(t, n).version
			} catch (e) {
				return null
			}
		}, t.diff = function(e, t) {
			if (X(e, t)) return null;
			var r = J(e),
				n = J(t),
				o = "";
			if (r.prerelease.length || n.prerelease.length) {
				o = "pre";
				var i = "prerelease"
			}
			for (var s in r)
				if (("major" === s || "minor" === s || "patch" === s) && r[s] !== n[s]) return o + s;
			return i
		}, t.compareIdentifiers = z;
		var G = /^[0-9]+$/;

		function z(e, t) {
			var r = G.test(e),
				n = G.test(t);
			return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1
		}

		function W(e, t, r) {
			return new F(e, r).compare(new F(t, r))
		}

		function Z(e, t, r) {
			return W(e, t, r) > 0
		}

		function Y(e, t, r) {
			return W(e, t, r) < 0
		}

		function X(e, t, r) {
			return 0 === W(e, t, r)
		}

		function Q(e, t, r) {
			return 0 !== W(e, t, r)
		}

		function ee(e, t, r) {
			return W(e, t, r) >= 0
		}

		function te(e, t, r) {
			return W(e, t, r) <= 0
		}

		function re(e, t, r, n) {
			switch (t) {
				case "===":
					return "object" == typeof e && (e = e.version), "object" == typeof r && (r = r.version), e === r;
				case "!==":
					return "object" == typeof e && (e = e.version), "object" == typeof r && (r = r.version), e !== r;
				case "":
				case "=":
				case "==":
					return X(e, r, n);
				case "!=":
					return Q(e, r, n);
				case ">":
					return Z(e, r, n);
				case ">=":
					return ee(e, r, n);
				case "<":
					return Y(e, r, n);
				case "<=":
					return te(e, r, n);
				default:
					throw new TypeError("Invalid operator: " + t)
			}
		}

		function ne(e, t) {
			if (t && "object" == typeof t || (t = {
					loose: !!t,
					includePrerelease: !1
				}), e instanceof ne) {
				if (e.loose === !!t.loose) return e;
				e = e.value
			}
			if (!(this instanceof ne)) return new ne(e, t);
			r("comparator", e, t), this.options = t, this.loose = !!t.loose, this.parse(e), this.semver === oe ? this.value =
				"" : this.value = this.operator + this.semver.version, r("comp", this)
		}
		t.rcompareIdentifiers = function(e, t) {
			return z(t, e)
		}, t.major = function(e, t) {
			return new F(e, t).major
		}, t.minor = function(e, t) {
			return new F(e, t).minor
		}, t.patch = function(e, t) {
			return new F(e, t).patch
		}, t.compare = W, t.compareLoose = function(e, t) {
			return W(e, t, !0)
		}, t.rcompare = function(e, t, r) {
			return W(t, e, r)
		}, t.sort = function(e, r) {
			return e.sort((function(e, n) {
				return t.compare(e, n, r)
			}))
		}, t.rsort = function(e, r) {
			return e.sort((function(e, n) {
				return t.rcompare(e, n, r)
			}))
		}, t.gt = Z, t.lt = Y, t.eq = X, t.neq = Q, t.gte = ee, t.lte = te, t.cmp = re, t.Comparator = ne;
		var oe = {};

		function ie(e, t) {
			if (t && "object" == typeof t || (t = {
					loose: !!t,
					includePrerelease: !1
				}), e instanceof ie) return e.loose === !!t.loose && e.includePrerelease === !!t.includePrerelease ? e : new ie(e
				.raw, t);
			if (e instanceof ne) return new ie(e.value, t);
			if (!(this instanceof ie)) return new ie(e, t);
			if (this.options = t, this.loose = !!t.loose, this.includePrerelease = !!t.includePrerelease, this.raw = e, this.set =
				e.split(/\s*\|\|\s*/).map((function(e) {
					return this.parseRange(e.trim())
				}), this).filter((function(e) {
					return e.length
				})), !this.set.length) throw new TypeError("Invalid SemVer Range: " + e);
			this.format()
		}

		function se(e) {
			return !e || "x" === e.toLowerCase() || "*" === e
		}

		function ae(e, t, r, n, o, i, s, a, c, u, f, p, l) {
			return ((t = se(r) ? "" : se(n) ? ">=" + r + ".0.0" : se(o) ? ">=" + r + "." + n + ".0" : ">=" + t) + " " + (a =
				se(c) ? "" : se(u) ? "<" + (+c + 1) + ".0.0" : se(f) ? "<" + c + "." + (+u + 1) + ".0" : p ? "<=" + c + "." + u +
				"." + f + "-" + p : "<=" + a)).trim()
		}

		function ce(e, t, n) {
			for (var o = 0; o < e.length; o++)
				if (!e[o].test(t)) return !1;
			if (t.prerelease.length && !n.includePrerelease) {
				for (o = 0; o < e.length; o++)
					if (r(e[o].semver), e[o].semver !== oe && e[o].semver.prerelease.length > 0) {
						var i = e[o].semver;
						if (i.major === t.major && i.minor === t.minor && i.patch === t.patch) return !0
					} return !1
			}
			return !0
		}

		function ue(e, t, r) {
			try {
				t = new ie(t, r)
			} catch (e) {
				return !1
			}
			return t.test(e)
		}

		function fe(e, t, r, n) {
			var o, i, s, a, c;
			switch (e = new F(e, n), t = new ie(t, n), r) {
				case ">":
					o = Z, i = te, s = Y, a = ">", c = ">=";
					break;
				case "<":
					o = Y, i = ee, s = Z, a = "<", c = "<=";
					break;
				default:
					throw new TypeError('Must provide a hilo val of "<" or ">"')
			}
			if (ue(e, t, n)) return !1;
			for (var u = 0; u < t.set.length; ++u) {
				var f = t.set[u],
					p = null,
					l = null;
				if (f.forEach((function(e) {
						e.semver === oe && (e = new ne(">=0.0.0")), p = p || e, l = l || e, o(e.semver, p.semver, n) ? p = e : s(e.semver,
							l.semver, n) && (l = e)
					})), p.operator === a || p.operator === c) return !1;
				if ((!l.operator || l.operator === a) && i(e, l.semver)) return !1;
				if (l.operator === c && s(e, l.semver)) return !1
			}
			return !0
		}
		ne.prototype.parse = function(e) {
			var t = this.options.loose ? o[M] : o[V],
				r = e.match(t);
			if (!r) throw new TypeError("Invalid comparator: " + e);
			this.operator = r[1], "=" === this.operator && (this.operator = ""), r[2] ? this.semver = new F(r[2], this.options
				.loose) : this.semver = oe
		}, ne.prototype.toString = function() {
			return this.value
		}, ne.prototype.test = function(e) {
			return r("Comparator.test", e, this.options.loose), this.semver === oe || ("string" == typeof e && (e = new F(e,
				this.options)), re(e, this.operator, this.semver, this.options))
		}, ne.prototype.intersects = function(e, t) {
			if (!(e instanceof ne)) throw new TypeError("a Comparator is required");
			var r;
			if (t && "object" == typeof t || (t = {
					loose: !!t,
					includePrerelease: !1
				}), "" === this.operator) return r = new ie(e.value, t), ue(this.value, r, t);
			if ("" === e.operator) return r = new ie(this.value, t), ue(e.semver, r, t);
			var n = !(">=" !== this.operator && ">" !== this.operator || ">=" !== e.operator && ">" !== e.operator),
				o = !("<=" !== this.operator && "<" !== this.operator || "<=" !== e.operator && "<" !== e.operator),
				i = this.semver.version === e.semver.version,
				s = !(">=" !== this.operator && "<=" !== this.operator || ">=" !== e.operator && "<=" !== e.operator),
				a = re(this.semver, "<", e.semver, t) && (">=" === this.operator || ">" === this.operator) && ("<=" === e.operator ||
					"<" === e.operator),
				c = re(this.semver, ">", e.semver, t) && ("<=" === this.operator || "<" === this.operator) && (">=" === e.operator ||
					">" === e.operator);
			return n || o || i && s || a || c
		}, t.Range = ie, ie.prototype.format = function() {
			return this.range = this.set.map((function(e) {
				return e.join(" ").trim()
			})).join("||").trim(), this.range
		}, ie.prototype.toString = function() {
			return this.range
		}, ie.prototype.parseRange = function(e) {
			var t = this.options.loose;
			e = e.trim();
			var n = t ? o[L] : o[K];
			e = e.replace(n, ae), r("hyphen replace", e), e = e.replace(o[q], "$1$2$3"), r("comparator trim", e, o[q]), e = (
				e = (e = e.replace(o[P], "$1~")).replace(o[N], "$1^")).split(/\s+/).join(" ");
			var i = t ? o[M] : o[V],
				s = e.split(" ").map((function(e) {
					return function(e, t) {
						return r("comp", e, t), e = function(e, t) {
							return e.trim().split(/\s+/).map((function(e) {
								return function(e, t) {
									r("caret", e, t);
									var n = t.loose ? o[D] : o[B];
									return e.replace(n, (function(t, n, o, i, s) {
										var a;
										return r("caret", e, t, n, o, i, s), se(n) ? a = "" : se(o) ? a = ">=" + n + ".0.0 <" + (+n + 1) +
											".0.0" : se(i) ? a = "0" === n ? ">=" + n + "." + o + ".0 <" + n + "." + (+o + 1) + ".0" :
											">=" + n + "." + o + ".0 <" + (+n + 1) + ".0.0" : s ? (r("replaceCaret pr", s), a = "0" === n ?
												"0" === o ? ">=" + n + "." + o + "." + i + "-" + s + " <" + n + "." + o + "." + (+i + 1) :
												">=" + n + "." + o + "." + i + "-" + s + " <" + n + "." + (+o + 1) + ".0" : ">=" + n + "." +
												o + "." + i + "-" + s + " <" + (+n + 1) + ".0.0") : (r("no pr"), a = "0" === n ? "0" === o ?
												">=" + n + "." + o + "." + i + " <" + n + "." + o + "." + (+i + 1) : ">=" + n + "." + o + "." +
												i + " <" + n + "." + (+o + 1) + ".0" : ">=" + n + "." + o + "." + i + " <" + (+n + 1) +
												".0.0"), r("caret return", a), a
									}))
								}(e, t)
							})).join(" ")
						}(e, t), r("caret", e), e = function(e, t) {
							return e.trim().split(/\s+/).map((function(e) {
								return function(e, t) {
									var n = t.loose ? o[$] : o[I];
									return e.replace(n, (function(t, n, o, i, s) {
										var a;
										return r("tilde", e, t, n, o, i, s), se(n) ? a = "" : se(o) ? a = ">=" + n + ".0.0 <" + (+n + 1) +
											".0.0" : se(i) ? a = ">=" + n + "." + o + ".0 <" + n + "." + (+o + 1) + ".0" : s ? (r(
													"replaceTilde pr", s), a = ">=" + n + "." + o + "." + i + "-" + s + " <" + n + "." + (+o + 1) +
												".0") : a = ">=" + n + "." + o + "." + i + " <" + n + "." + (+o + 1) + ".0", r("tilde return",
												a), a
									}))
								}(e, t)
							})).join(" ")
						}(e, t), r("tildes", e), e = function(e, t) {
							return r("replaceXRanges", e, t), e.split(/\s+/).map((function(e) {
								return function(e, t) {
									e = e.trim();
									var n = t.loose ? o[O] : o[T];
									return e.replace(n, (function(t, n, o, i, s, a) {
										r("xRange", e, t, n, o, i, s, a);
										var c = se(o),
											u = c || se(i),
											f = u || se(s);
										return "=" === n && f && (n = ""), c ? t = ">" === n || "<" === n ? "<0.0.0" : "*" : n && f ? (
												u && (i = 0), s = 0, ">" === n ? (n = ">=", u ? (o = +o + 1, i = 0, s = 0) : (i = +i + 1, s =
													0)) : "<=" === n && (n = "<", u ? o = +o + 1 : i = +i + 1), t = n + o + "." + i + "." + s) :
											u ? t = ">=" + o + ".0.0 <" + (+o + 1) + ".0.0" : f && (t = ">=" + o + "." + i + ".0 <" + o +
												"." + (+i + 1) + ".0"), r("xRange return", t), t
									}))
								}(e, t)
							})).join(" ")
						}(e, t), r("xrange", e), e = function(e, t) {
							return r("replaceStars", e, t), e.trim().replace(o[H], "")
						}(e, t), r("stars", e), e
					}(e, this.options)
				}), this).join(" ").split(/\s+/);
			return this.options.loose && (s = s.filter((function(e) {
				return !!e.match(i)
			}))), s = s.map((function(e) {
				return new ne(e, this.options)
			}), this)
		}, ie.prototype.intersects = function(e, t) {
			if (!(e instanceof ie)) throw new TypeError("a Range is required");
			return this.set.some((function(r) {
				return r.every((function(r) {
					return e.set.some((function(e) {
						return e.every((function(e) {
							return r.intersects(e, t)
						}))
					}))
				}))
			}))
		}, t.toComparators = function(e, t) {
			return new ie(e, t).set.map((function(e) {
				return e.map((function(e) {
					return e.value
				})).join(" ").trim().split(" ")
			}))
		}, ie.prototype.test = function(e) {
			if (!e) return !1;
			"string" == typeof e && (e = new F(e, this.options));
			for (var t = 0; t < this.set.length; t++)
				if (ce(this.set[t], e, this.options)) return !0;
			return !1
		}, t.satisfies = ue, t.maxSatisfying = function(e, t, r) {
			var n = null,
				o = null;
			try {
				var i = new ie(t, r)
			} catch (e) {
				return null
			}
			return e.forEach((function(e) {
				i.test(e) && (n && -1 !== o.compare(e) || (o = new F(n = e, r)))
			})), n
		}, t.minSatisfying = function(e, t, r) {
			var n = null,
				o = null;
			try {
				var i = new ie(t, r)
			} catch (e) {
				return null
			}
			return e.forEach((function(e) {
				i.test(e) && (n && 1 !== o.compare(e) || (o = new F(n = e, r)))
			})), n
		}, t.minVersion = function(e, t) {
			e = new ie(e, t);
			var r = new F("0.0.0");
			if (e.test(r)) return r;
			if (r = new F("0.0.0-0"), e.test(r)) return r;
			r = null;
			for (var n = 0; n < e.set.length; ++n) {
				e.set[n].forEach((function(e) {
					var t = new F(e.semver.version);
					switch (e.operator) {
						case ">":
							0 === t.prerelease.length ? t.patch++ : t.prerelease.push(0), t.raw = t.format();
						case "":
						case ">=":
							r && !Z(r, t) || (r = t);
							break;
						case "<":
						case "<=":
							break;
						default:
							throw new Error("Unexpected operation: " + e.operator)
					}
				}))
			}
			if (r && e.test(r)) return r;
			return null
		}, t.validRange = function(e, t) {
			try {
				return new ie(e, t).range || "*"
			} catch (e) {
				return null
			}
		}, t.ltr = function(e, t, r) {
			return fe(e, t, "<", r)
		}, t.gtr = function(e, t, r) {
			return fe(e, t, ">", r)
		}, t.outside = fe, t.prerelease = function(e, t) {
			var r = J(e, t);
			return r && r.prerelease.length ? r.prerelease : null
		}, t.intersects = function(e, t, r) {
			return e = new ie(e, r), t = new ie(t, r), e.intersects(t)
		}, t.coerce = function(e) {
			if (e instanceof F) return e;
			if ("string" != typeof e) return null;
			var t = e.match(o[A]);
			if (null == t) return null;
			return J(t[1] + "." + (t[2] || "0") + "." + (t[3] || "0"))
		}
	})),
	Fe = (Je.SEMVER_SPEC_VERSION, Je.re, Je.src, Je.parse, Je.valid, Je.clean, Je.SemVer, Je.inc, Je.diff, Je.compareIdentifiers,
		Je.rcompareIdentifiers, Je.major, Je.minor, Je.patch, Je.compare, Je.compareLoose, Je.rcompare, Je.sort, Je.rsort, Je
		.gt, Je.lt, Je.eq, Je.neq, Je.gte, Je.lte, Je.cmp, Je.Comparator, Je.Range, Je.toComparators, Je.satisfies, Je.maxSatisfying,
		Je.minSatisfying, Je.minVersion, Je.validRange, Je.ltr, Je.gtr, Je.outside, Je.prerelease, Je.intersects, Je.coerce,
		Je.satisfies(process.version, "^6.12.0 || >=8.0.0")),
	Ge = ["RS256", "RS384", "RS512", "ES256", "ES384", "ES512"],
	ze = ["RS256", "RS384", "RS512"],
	We = ["HS256", "HS384", "HS512"];
Fe && (Ge.splice(3, 0, "PS256", "PS384", "PS512"), ze.splice(3, 0, "PS256", "PS384", "PS512"));
var Ze = /^\s+|\s+$/g,
	Ye = /^[-+]0x[0-9a-f]+$/i,
	Xe = /^0b[01]+$/i,
	Qe = /^0o[0-7]+$/i,
	et = /^(?:0|[1-9]\d*)$/,
	tt = parseInt;

function rt(e) {
	return e != e
}

function nt(e, t) {
	return function(e, t) {
		for (var r = -1, n = e ? e.length : 0, o = Array(n); ++r < n;) o[r] = t(e[r], r, e);
		return o
	}(t, (function(t) {
		return e[t]
	}))
}
var ot, it, st = Object.prototype,
	at = st.hasOwnProperty,
	ct = st.toString,
	ut = st.propertyIsEnumerable,
	ft = (ot = Object.keys, it = Object, function(e) {
		return ot(it(e))
	}),
	pt = Math.max;

function lt(e, t) {
	var r = mt(e) || function(e) {
			return function(e) {
				return wt(e) && gt(e)
			}(e) && at.call(e, "callee") && (!ut.call(e, "callee") || "[object Arguments]" == ct.call(e))
		}(e) ? function(e, t) {
			for (var r = -1, n = Array(e); ++r < e;) n[r] = t(r);
			return n
		}(e.length, String) : [],
		n = r.length,
		o = !!n;
	for (var i in e) !t && !at.call(e, i) || o && ("length" == i || ht(i, n)) || r.push(i);
	return r
}

function dt(e) {
	if (r = (t = e) && t.constructor, n = "function" == typeof r && r.prototype || st, t !== n) return ft(e);
	var t, r, n, o = [];
	for (var i in Object(e)) at.call(e, i) && "constructor" != i && o.push(i);
	return o
}

function ht(e, t) {
	return !!(t = null == t ? 9007199254740991 : t) && ("number" == typeof e || et.test(e)) && e > -1 && e % 1 == 0 && e <
		t
}
var mt = Array.isArray;

function gt(e) {
	return null != e && function(e) {
		return "number" == typeof e && e > -1 && e % 1 == 0 && e <= 9007199254740991
	}(e.length) && ! function(e) {
		var t = yt(e) ? ct.call(e) : "";
		return "[object Function]" == t || "[object GeneratorFunction]" == t
	}(e)
}

function yt(e) {
	var t = typeof e;
	return !!e && ("object" == t || "function" == t)
}

function wt(e) {
	return !!e && "object" == typeof e
}
var vt = function(e, t, r, n) {
		var o;
		e = gt(e) ? e : (o = e) ? nt(o, function(e) {
			return gt(e) ? lt(e) : dt(e)
		}(o)) : [], r = r && !n ? function(e) {
			var t = function(e) {
					if (!e) return 0 === e ? e : 0;
					if ((e = function(e) {
							if ("number" == typeof e) return e;
							if (function(e) {
									return "symbol" == typeof e || wt(e) && "[object Symbol]" == ct.call(e)
								}(e)) return NaN;
							if (yt(e)) {
								var t = "function" == typeof e.valueOf ? e.valueOf() : e;
								e = yt(t) ? t + "" : t
							}
							if ("string" != typeof e) return 0 === e ? e : +e;
							e = e.replace(Ze, "");
							var r = Xe.test(e);
							return r || Qe.test(e) ? tt(e.slice(2), r ? 2 : 8) : Ye.test(e) ? NaN : +e
						}(e)) === 1 / 0 || e === -1 / 0) {
						return 17976931348623157e292 * (e < 0 ? -1 : 1)
					}
					return e == e ? e : 0
				}(e),
				r = t % 1;
			return t == t ? r ? t - r : t : 0
		}(r) : 0;
		var i = e.length;
		return r < 0 && (r = pt(i + r, 0)),
			function(e) {
				return "string" == typeof e || !mt(e) && wt(e) && "[object String]" == ct.call(e)
			}(e) ? r <= i && e.indexOf(t, r) > -1 : !!i && function(e, t, r) {
				if (t != t) return function(e, t, r, n) {
					for (var o = e.length, i = r + (n ? 1 : -1); n ? i-- : ++i < o;)
						if (t(e[i], i, e)) return i;
					return -1
				}(e, rt, r);
				for (var n = r - 1, o = e.length; ++n < o;)
					if (e[n] === t) return n;
				return -1
			}(e, t, r) > -1
	},
	bt = Object.prototype.toString;
var St = function(e) {
		return !0 === e || !1 === e || function(e) {
			return !!e && "object" == typeof e
		}(e) && "[object Boolean]" == bt.call(e)
	},
	_t = /^\s+|\s+$/g,
	Et = /^[-+]0x[0-9a-f]+$/i,
	xt = /^0b[01]+$/i,
	jt = /^0o[0-7]+$/i,
	kt = parseInt,
	Tt = Object.prototype.toString;

function Ot(e) {
	var t = typeof e;
	return !!e && ("object" == t || "function" == t)
}
var At = function(e) {
		return "number" == typeof e && e == function(e) {
			var t = function(e) {
					if (!e) return 0 === e ? e : 0;
					if ((e = function(e) {
							if ("number" == typeof e) return e;
							if (function(e) {
									return "symbol" == typeof e || function(e) {
										return !!e && "object" == typeof e
									}(e) && "[object Symbol]" == Tt.call(e)
								}(e)) return NaN;
							if (Ot(e)) {
								var t = "function" == typeof e.valueOf ? e.valueOf() : e;
								e = Ot(t) ? t + "" : t
							}
							if ("string" != typeof e) return 0 === e ? e : +e;
							e = e.replace(_t, "");
							var r = xt.test(e);
							return r || jt.test(e) ? kt(e.slice(2), r ? 2 : 8) : Et.test(e) ? NaN : +e
						}(e)) === 1 / 0 || e === -1 / 0) {
						return 17976931348623157e292 * (e < 0 ? -1 : 1)
					}
					return e == e ? e : 0
				}(e),
				r = t % 1;
			return t == t ? r ? t - r : t : 0
		}(e)
	},
	Rt = Object.prototype.toString;
var Pt = function(e) {
	return "number" == typeof e || function(e) {
		return !!e && "object" == typeof e
	}(e) && "[object Number]" == Rt.call(e)
};
var It = Function.prototype,
	$t = Object.prototype,
	Ct = It.toString,
	Nt = $t.hasOwnProperty,
	Bt = Ct.call(Object),
	Dt = $t.toString,
	Mt = function(e, t) {
		return function(r) {
			return e(t(r))
		}
	}(Object.getPrototypeOf, Object);
var Vt = function(e) {
		if (! function(e) {
				return !!e && "object" == typeof e
			}(e) || "[object Object]" != Dt.call(e) || function(e) {
				var t = !1;
				if (null != e && "function" != typeof e.toString) try {
					t = !!(e + "")
				} catch (e) {}
				return t
			}(e)) return !1;
		var t = Mt(e);
		if (null === t) return !0;
		var r = Nt.call(t, "constructor") && t.constructor;
		return "function" == typeof r && r instanceof r && Ct.call(r) == Bt
	},
	qt = Object.prototype.toString,
	Kt = Array.isArray;
var Lt = function(e) {
		return "string" == typeof e || !Kt(e) && function(e) {
			return !!e && "object" == typeof e
		}(e) && "[object String]" == qt.call(e)
	},
	Ht = /^\s+|\s+$/g,
	Ut = /^[-+]0x[0-9a-f]+$/i,
	Jt = /^0b[01]+$/i,
	Ft = /^0o[0-7]+$/i,
	Gt = parseInt,
	zt = Object.prototype.toString;

function Wt(e, t) {
	var r;
	if ("function" != typeof t) throw new TypeError("Expected a function");
	return e = function(e) {
			var t = function(e) {
					if (!e) return 0 === e ? e : 0;
					if ((e = function(e) {
							if ("number" == typeof e) return e;
							if (function(e) {
									return "symbol" == typeof e || function(e) {
										return !!e && "object" == typeof e
									}(e) && "[object Symbol]" == zt.call(e)
								}(e)) return NaN;
							if (Zt(e)) {
								var t = "function" == typeof e.valueOf ? e.valueOf() : e;
								e = Zt(t) ? t + "" : t
							}
							if ("string" != typeof e) return 0 === e ? e : +e;
							e = e.replace(Ht, "");
							var r = Jt.test(e);
							return r || Ft.test(e) ? Gt(e.slice(2), r ? 2 : 8) : Ut.test(e) ? NaN : +e
						}(e)) === 1 / 0 || e === -1 / 0) {
						return 17976931348623157e292 * (e < 0 ? -1 : 1)
					}
					return e == e ? e : 0
				}(e),
				r = t % 1;
			return t == t ? r ? t - r : t : 0
		}(e),
		function() {
			return --e > 0 && (r = t.apply(this, arguments)), e <= 1 && (t = void 0), r
		}
}

function Zt(e) {
	var t = typeof e;
	return !!e && ("object" == t || "function" == t)
}
var Yt = function(e) {
		return Wt(2, e)
	},
	Xt = ["RS256", "RS384", "RS512", "ES256", "ES384", "ES512", "HS256", "HS384", "HS512", "none"];
Fe && Xt.splice(3, 0, "PS256", "PS384", "PS512");
var Qt = {
		expiresIn: {
			isValid: function(e) {
				return At(e) || Lt(e) && e
			},
			message: '"expiresIn" should be a number of seconds or string representing a timespan'
		},
		notBefore: {
			isValid: function(e) {
				return At(e) || Lt(e) && e
			},
			message: '"notBefore" should be a number of seconds or string representing a timespan'
		},
		audience: {
			isValid: function(e) {
				return Lt(e) || Array.isArray(e)
			},
			message: '"audience" must be a string or array'
		},
		algorithm: {
			isValid: vt.bind(null, Xt),
			message: '"algorithm" must be a valid string enum value'
		},
		header: {
			isValid: Vt,
			message: '"header" must be an object'
		},
		encoding: {
			isValid: Lt,
			message: '"encoding" must be a string'
		},
		issuer: {
			isValid: Lt,
			message: '"issuer" must be a string'
		},
		subject: {
			isValid: Lt,
			message: '"subject" must be a string'
		},
		jwtid: {
			isValid: Lt,
			message: '"jwtid" must be a string'
		},
		noTimestamp: {
			isValid: St,
			message: '"noTimestamp" must be a boolean'
		},
		keyid: {
			isValid: Lt,
			message: '"keyid" must be a string'
		},
		mutatePayload: {
			isValid: St,
			message: '"mutatePayload" must be a boolean'
		}
	},
	er = {
		iat: {
			isValid: Pt,
			message: '"iat" should be a number of seconds'
		},
		exp: {
			isValid: Pt,
			message: '"exp" should be a number of seconds'
		},
		nbf: {
			isValid: Pt,
			message: '"nbf" should be a number of seconds'
		}
	};

function tr(e, t, r, n) {
	if (!Vt(r)) throw new Error('Expected "' + n + '" to be a plain object.');
	Object.keys(r).forEach((function(o) {
		var i = e[o];
		if (i) {
			if (!i.isValid(r[o])) throw new Error(i.message)
		} else if (!t) throw new Error('"' + o + '" is not allowed in "' + n + '"')
	}))
}
var rr = {
		audience: "aud",
		issuer: "iss",
		subject: "sub",
		jwtid: "jti"
	},
	nr = ["expiresIn", "notBefore", "noTimestamp", "audience", "issuer", "subject", "jwtid"],
	or = function(e, t, r, n) {
		var o;
		if ("function" != typeof r || n || (n = r, r = {}), r || (r = {}), r = Object.assign({}, r), o = n || function(e, t) {
				if (e) throw e;
				return t
			}, r.clockTimestamp && "number" != typeof r.clockTimestamp) return o(new $e("clockTimestamp must be a number"));
		if (void 0 !== r.nonce && ("string" != typeof r.nonce || "" === r.nonce.trim())) return o(new $e(
			"nonce must be a non-empty string"));
		var i = r.clockTimestamp || Math.floor(Date.now() / 1e3);
		if (!e) return o(new $e("jwt must be provided"));
		if ("string" != typeof e) return o(new $e("jwt must be a string"));
		var s, a = e.split(".");
		if (3 !== a.length) return o(new $e("jwt malformed"));
		try {
			s = Pe(e, {
				complete: !0
			})
		} catch (e) {
			return o(e)
		}
		if (!s) return o(new $e("invalid token"));
		var c, u = s.header;
		if ("function" == typeof t) {
			if (!n) return o(new $e("verify must be called asynchronous if secret or public key is provided as a callback"));
			c = t
		} else c = function(e, r) {
			return r(null, t)
		};
		return c(u, (function(t, n) {
			if (t) return o(new $e("error in secret or public key callback: " + t.message));
			var c, f = "" !== a[2].trim();
			if (!f && n) return o(new $e("jwt signature is required"));
			if (f && !n) return o(new $e("secret or public key must be provided"));
			if (f || r.algorithms || (r.algorithms = ["none"]), r.algorithms || (r.algorithms = ~n.toString().indexOf(
					"BEGIN CERTIFICATE") || ~n.toString().indexOf("BEGIN PUBLIC KEY") ? Ge : ~n.toString().indexOf(
					"BEGIN RSA PUBLIC KEY") ? ze : We), !~r.algorithms.indexOf(s.header.alg)) return o(new $e("invalid algorithm"));
			try {
				c = Re.verify(e, s.header.alg, n)
			} catch (e) {
				return o(e)
			}
			if (!c) return o(new $e("invalid signature"));
			var p = s.payload;
			if (void 0 !== p.nbf && !r.ignoreNotBefore) {
				if ("number" != typeof p.nbf) return o(new $e("invalid nbf value"));
				if (p.nbf > i + (r.clockTolerance || 0)) return o(new Ne("jwt not active", new Date(1e3 * p.nbf)))
			}
			if (void 0 !== p.exp && !r.ignoreExpiration) {
				if ("number" != typeof p.exp) return o(new $e("invalid exp value"));
				if (i >= p.exp + (r.clockTolerance || 0)) return o(new De("jwt expired", new Date(1e3 * p.exp)))
			}
			if (r.audience) {
				var l = Array.isArray(r.audience) ? r.audience : [r.audience];
				if (!(Array.isArray(p.aud) ? p.aud : [p.aud]).some((function(e) {
						return l.some((function(t) {
							return t instanceof RegExp ? t.test(e) : t === e
						}))
					}))) return o(new $e("jwt audience invalid. expected: " + l.join(" or ")))
			}
			if (r.issuer && ("string" == typeof r.issuer && p.iss !== r.issuer || Array.isArray(r.issuer) && -1 === r.issuer.indexOf(
					p.iss))) return o(new $e("jwt issuer invalid. expected: " + r.issuer));
			if (r.subject && p.sub !== r.subject) return o(new $e("jwt subject invalid. expected: " + r.subject));
			if (r.jwtid && p.jti !== r.jwtid) return o(new $e("jwt jwtid invalid. expected: " + r.jwtid));
			if (r.nonce && p.nonce !== r.nonce) return o(new $e("jwt nonce invalid. expected: " + r.nonce));
			if (r.maxAge) {
				if ("number" != typeof p.iat) return o(new $e("iat required when maxAge is specified"));
				var d = Ue(r.maxAge, p.iat);
				if (void 0 === d) return o(new $e(
					'"maxAge" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
				if (i >= d + (r.clockTolerance || 0)) return o(new De("maxAge exceeded", new Date(1e3 * d)))
			}
			if (!0 === r.complete) {
				var h = s.signature;
				return o(null, {
					header: u,
					payload: p,
					signature: h
				})
			}
			return o(null, p)
		}))
	},
	ir = function(e, t, r, n) {
		"function" == typeof r ? (n = r, r = {}) : r = r || {};
		var o = "object" == typeof e && !Buffer.isBuffer(e),
			i = Object.assign({
				alg: r.algorithm || "HS256",
				typ: o ? "JWT" : void 0,
				kid: r.keyid
			}, r.header);

		function s(e) {
			if (n) return n(e);
			throw e
		}
		if (!t && "none" !== r.algorithm) return s(new Error("secretOrPrivateKey must have a value"));
		if (void 0 === e) return s(new Error("payload is required"));
		if (o) {
			try {
				! function(e) {
					tr(er, !0, e, "payload")
				}(e)
			} catch (e) {
				return s(e)
			}
			r.mutatePayload || (e = Object.assign({}, e))
		} else {
			var a = nr.filter((function(e) {
				return void 0 !== r[e]
			}));
			if (a.length > 0) return s(new Error("invalid " + a.join(",") + " option for " + typeof e + " payload"))
		}
		if (void 0 !== e.exp && void 0 !== r.expiresIn) return s(new Error(
			'Bad "options.expiresIn" option the payload already has an "exp" property.'));
		if (void 0 !== e.nbf && void 0 !== r.notBefore) return s(new Error(
			'Bad "options.notBefore" option the payload already has an "nbf" property.'));
		try {
			! function(e) {
				tr(Qt, !1, e, "options")
			}(r)
		} catch (e) {
			return s(e)
		}
		var c = e.iat || Math.floor(Date.now() / 1e3);
		if (r.noTimestamp ? delete e.iat : o && (e.iat = c), void 0 !== r.notBefore) {
			try {
				e.nbf = Ue(r.notBefore, c)
			} catch (e) {
				return s(e)
			}
			if (void 0 === e.nbf) return s(new Error(
				'"notBefore" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'))
		}
		if (void 0 !== r.expiresIn && "object" == typeof e) {
			try {
				e.exp = Ue(r.expiresIn, c)
			} catch (e) {
				return s(e)
			}
			if (void 0 === e.exp) return s(new Error(
				'"expiresIn" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'))
		}
		Object.keys(rr).forEach((function(t) {
			var n = rr[t];
			if (void 0 !== r[t]) {
				if (void 0 !== e[n]) return s(new Error('Bad "options.' + t + '" option. The payload already has an "' + n +
					'" property.'));
				e[n] = r[t]
			}
		}));
		var u = r.encoding || "utf8";
		if ("function" != typeof n) return Re.sign({
			header: i,
			payload: e,
			secret: t,
			encoding: u
		});
		n = n && Yt(n), Re.createSign({
			header: i,
			privateKey: t,
			payload: e,
			encoding: u
		}).once("error", n).once("done", (function(e) {
			n(null, e)
		}))
	};

function sr() {
	const e = t.createHash("md5");
	return e.update(__ctx__.CLIENTUA), e.digest("hex")
}
const ar = {
		createToken: function(e) {
			const t = k();
			return {
				token: ir({
					uid: e._id,
					clientId: sr()
				}, t.tokenSecret, {
					expiresIn: t.tokenExpiresIn
				}),
				tokenExpired: Date.now() + 1e3 * t.tokenExpiresIn
			}
		},
		refreshToken: function() {},
		checkToken: async function(e) {
			const t = k();
			try {
				const r = or(e, t.tokenSecret);
				if (console.log(r), r.clientId !== sr()) return {
					code: 1302,
					msg: "token不合法，请重新登录"
				};
				const n = await j.doc(r.uid).get();
				if (!n.data || 0 === n.data.length || !n.data[0].token) return {
					code: 1302,
					msg: "token不合法，请重新登录"
				};
				let o = n.data[0].token;
				return "string" == typeof o && (o = [o]), -1 === o.indexOf(e) ? {
					code: 1302,
					msg: "token不合法，请重新登录"
				} : (_("checkToken payload", r), r)
			} catch (e) {
				return "TokenExpiredError" === e.name ? {
					code: 1301,
					msg: "token已过期，请重新登录",
					err: e
				} : {
					code: 1302,
					msg: "非法token",
					err: e
				}
			}
		},
		getExpiredToken(e) {
			const t = k(),
				r = [];
			return e.forEach(e => {
				try {
					or(e, t.tokenSecret)
				} catch (t) {
					r.push(e)
				}
			}), r
		}
	},
	cr = uniCloud.database();
const ur = uniCloud.database();
async function fr({
	name: e,
	url: t,
	data: r,
	options: n,
	defaultOptions: o
}) {
	let i = {};
	const s = b(Object.assign({}, r));
	s && s.access_token && delete s.access_token;
	try {
		n = Object.assign({}, o, n, {
			data: s
		}), i = await uniCloud.httpclient.request(t, n)
	} catch (t) {
		return function(e, t) {
			throw new c({
				code: t.code || -2,
				message: t.message || e + " fail"
			})
		}(e, t)
	}
	let a = i.data;
	const u = i.headers["content-type"];
	if (!Buffer.isBuffer(a) || 0 !== u.indexOf("text/plain") && 0 !== u.indexOf("application/json")) Buffer.isBuffer(a) &&
		(a = {
			buffer: a,
			contentType: u
		});
	else try {
		a = JSON.parse(a.toString())
	} catch (e) {
		a = a.toString()
	}
	return v(function(e, t) {
		if (t.errcode) throw new c({
			code: t.errcode || -2,
			message: t.errmsg || e + " fail"
		});
		return delete t.errcode, delete t.errmsg, { ...t,
			errMsg: e + " ok",
			errCode: 0
		}
	}(e, a || {
		errCode: -2,
		errMsg: "Request failed"
	}))
}

function pr(e, t) {
	let r = "";
	if (t && t.accessToken) {
		r = `${e.indexOf("?")>-1?"&":"?"}access_token=${t.accessToken}`
	}
	return `${e}${r}`
}
class lr {
	constructor(e) {
		this.options = Object.assign({
			baseUrl: "https://api.weixin.qq.com",
			timeout: 5e3
		}, e)
	}
	async _requestWxOpenapi({
		name: e,
		url: t,
		data: r,
		options: n
	}) {
		const o = {
			method: "GET",
			dataType: "json",
			dataAsQueryString: !0,
			timeout: this.options.timeout
		};
		return await fr({
			name: "auth." + e,
			url: `${this.options.baseUrl}${pr(t,r)}`,
			data: r,
			options: n,
			defaultOptions: o
		})
	}
	async code2Session(e) {
		return await this._requestWxOpenapi({
			name: "code2Session",
			url: "/sns/jscode2session",
			data: {
				grant_type: "authorization_code",
				appid: this.options.appId,
				secret: this.options.secret,
				js_code: e
			}
		})
	}
	async getOauthAccessToken(e) {
		return await this._requestWxOpenapi({
			name: "getOauthAccessToken",
			url: "/sns/oauth2/access_token",
			data: {
				grant_type: "authorization_code",
				appid: this.options.appId,
				secret: this.options.secret,
				code: e
			}
		})
	}
}
const dr = {
	RSA: "RSA-SHA1",
	RSA2: "RSA-SHA256"
};
var hr = {
	code2Session: {
		returnValue: {
			openid: "userId"
		}
	}
};
class mr extends class {
	constructor(e = {}) {
		if (!e.appId) throw new Error("appId required");
		if (!e.privateKey) throw new Error("privateKey required");
		const t = {
			gateway: "https://openapi.alipay.com/gateway.do",
			timeout: 5e3,
			charset: "utf-8",
			version: "1.0",
			signType: "RSA2",
			timeOffset: -(new Date).getTimezoneOffset() / 60,
			keyType: "PKCS8"
		};
		e.sandbox && (e.gateway = "https://openapi.alipaydev.com/gateway.do"), this.options = Object.assign({}, t, e);
		const r = "PKCS8" === this.options.keyType ? "PRIVATE KEY" : "RSA PRIVATE KEY";
		this.options.privateKey = this._formatKey(this.options.privateKey, r), this.options.alipayPublicKey && (this.options
			.alipayPublicKey = this._formatKey(this.options.alipayPublicKey, "PUBLIC KEY"))
	}
	_formatKey(e, t) {
		return `-----BEGIN ${t}-----\n${e}\n-----END ${t}-----`
	}
	_formatUrl(e, t) {
		let r = e;
		const n = ["app_id", "method", "format", "charset", "sign_type", "sign", "timestamp", "version", "notify_url",
			"return_url", "auth_token", "app_auth_token"
		];
		for (const e in t)
			if (n.indexOf(e) > -1) {
				const n = encodeURIComponent(t[e]);
				r = `${r}${r.includes("?")?"&":"?"}${e}=${n}`, delete t[e]
			} return {
			execParams: t,
			url: r
		}
	}
	_getSign(e, r) {
		const n = r.bizContent || null;
		delete r.bizContent;
		const o = Object.assign({
			method: e,
			appId: this.options.appId,
			charset: this.options.charset,
			version: this.options.version,
			signType: this.options.signType,
			timestamp: S((i = this.options.timeOffset, new Date(Date.now() + 6e4 * ((new Date).getTimezoneOffset() + 60 * (i ||
				0)))))
		}, r);
		var i;
		n && (o.bizContent = JSON.stringify(b(n)));
		const s = b(o),
			a = Object.keys(s).sort().map(e => {
				let t = s[e];
				return "[object String]" !== Array.prototype.toString.call(t) && (t = JSON.stringify(t)), `${e}=${t}`
			}).join("&"),
			c = t.createSign(dr[this.options.signType]).update(a, "utf8").sign(this.options.privateKey, "base64");
		return Object.assign(s, {
			sign: c
		})
	}
	async _exec(e, t = {}, r = {}) {
		const n = this._getSign(e, t),
			{
				url: o,
				execParams: i
			} = this._formatUrl(this.options.gateway, n),
			{
				status: s,
				data: a
			} = await uniCloud.httpclient.request(o, {
				method: "POST",
				data: i,
				dataType: "text",
				timeout: this.options.timeout
			});
		if (200 !== s) throw new Error("request fail");
		const c = JSON.parse(a),
			u = e.replace(/\./g, "_") + "_response",
			f = c[u],
			p = c.error_response;
		if (f) {
			if (!r.validateSign || this._checkResponseSign(a, u)) {
				if (!f.code || "10000" === f.code) {
					return {
						errCode: 0,
						errMsg: f.msg || "",
						...v(f)
					}
				}
				const e = f.sub_code ? `${f.sub_code} ${f.sub_msg}` : "" + (f.msg || "unkonwn error");
				throw new Error(e)
			}
			throw new Error("返回结果签名错误")
		}
		if (p) throw new Error(p.sub_msg || p.msg || "接口返回错误");
		throw new Error("request fail")
	}
	_checkResponseSign(e, r) {
		if (!this.options.alipayPublicKey || "" === this.options.alipayPublicKey) return console.warn(
			"options.alipayPublicKey is empty"), !0;
		if (!e) return !1;
		const n = this._getSignStr(e, r),
			o = JSON.parse(e).sign,
			i = t.createVerify(dr[this.options.signType]);
		return i.update(n, "utf8"), i.verify(this.options.alipayPublicKey, o, "base64")
	}
	_getSignStr(e, t) {
		let r = e.trim();
		const n = e.indexOf(t + '"'),
			o = e.lastIndexOf('"sign"');
		return r = r.substr(n + t.length + 1), r = r.substr(0, o), r = r.replace(/^[^{]*{/g, "{"), r = r.replace(
			/\}([^}]*)$/g, "}"), r
	}
	_notifyRSACheck(e, r, n) {
		const o = Object.keys(e).sort().filter(e => e).map(t => {
			let r = e[t];
			return "[object String]" !== Array.prototype.toString.call(r) && (r = JSON.stringify(r)),
				`${t}=${decodeURIComponent(r)}`
		}).join("&");
		return t.createVerify(dr[n]).update(o, "utf8").verify(this.options.alipayPublicKey, r, "base64")
	}
	_checkNotifySign(e) {
		const t = e.sign;
		if (!this.options.alipayPublicKey || !t) return !1;
		const r = e.sign_type || this.options.signType || "RSA2",
			n = { ...e
			};
		delete n.sign, n.sign_type = r;
		return !!this._notifyRSACheck(n, t, r) || (delete n.sign_type, this._notifyRSACheck(n, t, r))
	}
	_verifyNotify(e) {
		if (!e.headers) throw new Error("通知格式不正确");
		let t;
		for (const r in e.headers) "content-type" === r.toLowerCase() && (t = e.headers[r]);
		if (!1 !== e.isBase64Encoded && -1 === t.indexOf("application/x-www-form-urlencoded")) throw new Error("通知格式不正确");
		const r = a.parse(e.body);
		if (this._checkNotifySign(r)) return v(r);
		throw new Error("通知验签未通过")
	}
} {
	constructor(e) {
		super(e), this._protocols = hr
	}
	async code2Session(e) {
		return await this._exec("alipay.system.oauth.token", {
			grantType: "authorization_code",
			code: e
		})
	}
}
var gr = function(e = {}) {
		return e.clientType = e.clientType || __ctx__.PLATFORM, e.appId = e.appid, e.secret = e.appsecret, x(lr, e)
	},
	yr = function(e = {}) {
		return e.clientType = e.clientType || __ctx__.PLATFORM, e.appId = e.appid, x(mr, e)
	};

function wr() {
	const e = k(),
		t = __ctx__.PLATFORM;
	if (!e.oauth || !e.oauth.weixin) throw new Error(`请在公用模块uni-id的config.json内添加${t}平台微信登录配置项`);
	["appid", "appsecret"].forEach(r => {
		if (!e.oauth.weixin[r]) throw new Error(`请在公用模块uni-id的config.json内添加配置项：${t}.oauth.weixin.${r}`)
	});
	return gr(e.oauth.weixin)
}
const vr = uniCloud.database();
const br = uniCloud.database();
const Sr = uniCloud.database();

function _r() {
	const e = k(),
		t = __ctx__.PLATFORM;
	if (!e.oauth || !e.oauth.alipay) throw new Error(`请在公用模块uni-id的config.json内添加${t}平台支付宝登录配置项`);
	["appid", "privateKey"].forEach(r => {
		if (!e.oauth.alipay[r]) throw new Error(`请在公用模块uni-id的config.json内添加配置项：${t}.oauth.alipay.${r}`)
	});
	return yr(e.oauth.alipay)
}
const Er = uniCloud.database();
const xr = uniCloud.database();
var jr = {
	register: async function(e) {
		const t = [],
			r = [{
				name: "username",
				desc: "用户名"
			}, {
				name: "email",
				desc: "邮箱",
				extraCond: {
					email_confirmed: 1
				}
			}, {
				name: "mobile",
				desc: "手机号",
				extraCond: {
					mobile_confirmed: 1
				}
			}];
		if (r.forEach(r => {
				const n = r.name;
				e[n] && e[n].trim() && t.push({
					[n]: e[n],
					...r.extraCond
				})
			}), 0 === t.length) return {
			code: 1001,
			msg: "用户名、邮箱、手机号不可同时为空"
		};
		e.username = e.username.trim();
		const n = cr.command,
			o = await j.where(n.or(...t)).get();
		if (_("userInDB:", o), o && o.data.length > 0) {
			const t = o.data[0];
			for (let n = 0; n < r.length; n++) {
				const o = r[n];
				let i = !0;
				if (o.extraCond && (i = Object.keys(o.extraCond).every(e => t[e] === o.extraCond[e])), t[o.name] === e[o.name] &&
					i) return {
					code: 1001,
					msg: o.desc + "已存在"
				}
			}
		}
		e.password = T(e.password), e.register_date = (new Date).getTime(), e.register_ip = __ctx__.CLIENTIP;
		const i = await j.add(e);
		_("addRes", i);
		const s = i.id,
			{
				token: a,
				tokenExpired: c
			} = ar.createToken({
				_id: s
			});
		return await j.doc(s).update({
			token: [a]
		}), i.id ? {
			code: 0,
			uid: s,
			username: e.username,
			msg: "注册成功",
			token: a,
			tokenExpired: c
		} : void 0
	},
	login: async function({
		username: e,
		password: t,
		queryField: r = []
	}) {
		const n = ur.command,
			o = [];
		r && r.length || (r = ["username"]);
		const i = {
			email: {
				email_confirmed: 1
			},
			mobile: {
				mobile_confirmed: 1
			}
		};
		r.forEach(t => {
			o.push({
				[t]: e,
				...i[t]
			})
		});
		const s = await j.where(n.or(...o)).limit(1).get();
		if (_("userInDB:", s), !(s && s.data && s.data.length > 0)) return {
			code: 1101,
			msg: "用户不存在"
		}; {
			const r = s.data[0],
				n = r.password;
			if (T(t) !== n) return {
				code: 1102,
				msg: "密码错误"
			};
			try {
				_("过期token清理");
				let t = r.token || [];
				"string" == typeof t && (t = [t]);
				const n = ar.getExpiredToken(t);
				t = t.filter(e => -1 === n.indexOf(e)), _("开始修改最后登录时间");
				const {
					token: o,
					tokenExpired: i
				} = ar.createToken(r);
				_("token", o), t.push(o);
				return _("upRes", await j.doc(r._id).update({
					last_login_date: (new Date).getTime(),
					last_login_ip: __ctx__.CLIENTIP,
					token: t
				})), {
					code: 0,
					token: o,
					uid: r._id,
					username: e,
					msg: "登录成功",
					tokenExpired: i
				}
			} catch (e) {
				return _("写入异常：", e), {
					code: 1104,
					msg: "数据库写入异常"
				}
			}
		}
	},
	loginByWeixin: async function(e) {
		const t = __ctx__.PLATFORM,
			{
				openid: r,
				unionid: n
			} = await wr()["mp-weixin" === t ? "code2Session" : "getOauthAccessToken"](e);
		if (!r) throw new Error("获取openid失败");
		const o = vr.command,
			i = [{
				wx_openid: {
					[t]: r
				}
			}];
		n && i.push({
			wx_unionid: n
		});
		const s = await j.where(o.or(...i)).get();
		if (s && s.data && s.data.length > 0) {
			const e = s.data[0];
			try {
				_("过期token清理");
				let o = e.token || [];
				const i = ar.getExpiredToken(o);
				o = o.filter(e => -1 === i.indexOf(e)), _("开始修改最后登录时间，写入unionid（可能不存在）和openid");
				const {
					token: s,
					tokenExpired: a
				} = ar.createToken(e);
				_("token", s), o.push(s);
				const c = {
					last_login_date: (new Date).getTime(),
					last_login_ip: __ctx__.CLIENTIP,
					token: o,
					wx_openid: {
						[t]: r
					}
				};
				n && (c.wx_unionid = n);
				return _("upRes", await j.doc(e._id).update(c)), {
					code: 0,
					token: s,
					uid: e._id,
					username: e.username,
					msg: "登录成功",
					tokenExpired: a
				}
			} catch (e) {
				return _("写入异常：", e), {
					code: 1104,
					msg: "数据库写入异常"
				}
			}
		} else try {
			const e = await j.add({
					register_date: (new Date).getTime(),
					register_ip: __ctx__.CLIENTIP,
					wx_openid: {
						[t]: r
					},
					wx_unionid: n
				}),
				o = e.id,
				{
					token: i,
					tokenExpired: s
				} = ar.createToken({
					_id: o
				});
			return await j.doc(o).update({
				token: [i]
			}), {
				code: 0,
				token: i,
				uid: e.id,
				msg: "登录成功",
				tokenExpired: s
			}
		} catch (e) {
			return _("写入异常：", e), {
				code: 1104,
				msg: "数据库写入异常"
			}
		}
	},
	bindWeixin: async function({
		uid: e,
		code: t
	}) {
		const r = __ctx__.PLATFORM,
			{
				openid: n,
				unionid: o
			} = await wr()["mp-weixin" === r ? "code2Session" : "getOauthAccessToken"](t);
		if (!n) throw new Error("获取openid失败");
		const i = br.command,
			s = [{
				wx_openid: {
					[r]: n
				}
			}];
		o && s.push({
			wx_unionid: o
		});
		const a = await j.where(i.or(...s)).get();
		if (a && a.data && a.data.length > 0) return {
			code: 1101,
			msg: "微信绑定失败，此微信账号已被绑定"
		};
		try {
			const t = {
				wx_openid: {
					[r]: n
				}
			};
			o && (t.wx_unionid = o);
			return 1 === (await j.doc(e).update(t)).updated ? {
				code: 0,
				msg: "绑定成功"
			} : {
				code: 1102,
				msg: "微信绑定失败，请稍后再试"
			}
		} catch (e) {
			return _("写入异常：", e), {
				code: 1104,
				msg: "数据库写入异常"
			}
		}
	},
	unbindWeixin: async function(e) {
		try {
			const t = Sr.command,
				r = await j.doc(e).update({
					wx_openid: t.remove(),
					wx_unionid: t.remove()
				});
			return _("upRes:", r), 1 === r.updated ? {
				code: 0,
				msg: "微信解绑成功"
			} : {
				code: 1102,
				msg: "微信解绑失败，请稍后再试"
			}
		} catch (e) {
			return _("写入异常：", e), {
				code: 1104,
				msg: "数据库写入异常"
			}
		}
	},
	loginByAlipay: async function(e) {
		const {
			openid: t
		} = await _r().code2Session(e);
		if (!t) throw new Error("获取openid失败");
		const r = await j.where({
			ali_openid: t
		}).get();
		if (r && r.data && r.data.length > 0) {
			const e = r.data[0];
			try {
				_("过期token清理");
				let t = e.token || [];
				const r = ar.getExpiredToken(t);
				t = t.filter(e => -1 === r.indexOf(e)), _("开始修改最后登录时间，写入openid");
				const {
					token: n,
					tokenExpired: o
				} = ar.createToken(e);
				_("token", n), t.push(n);
				return _("upRes", await j.doc(e._id).update({
					last_login_date: (new Date).getTime(),
					last_login_ip: __ctx__.CLIENTIP,
					token: t
				})), {
					code: 0,
					token: n,
					uid: e._id,
					username: e.username,
					msg: "登录成功",
					tokenExpired: o
				}
			} catch (e) {
				return _("写入异常：", e), {
					code: 1104,
					msg: "数据库写入异常"
				}
			}
		} else try {
			const e = await j.add({
					register_date: (new Date).getTime(),
					register_ip: __ctx__.CLIENTIP,
					ali_openid: t
				}),
				r = e.id,
				{
					token: n,
					tokenExpired: o
				} = ar.createToken({
					_id: r
				});
			return await j.doc(r).update({
				token: [n]
			}), {
				code: 0,
				token: n,
				uid: e.id,
				msg: "登录成功",
				tokenExpired: o
			}
		} catch (e) {
			return _("写入异常：", e), {
				code: 1104,
				msg: "数据库写入异常"
			}
		}
	},
	bindAlipay: async function({
		uid: e,
		code: t
	}) {
		const {
			openid: r
		} = await _r().code2Session(t);
		if (!r) throw new Error("获取openid失败");
		const n = await j.where({
			ali_openid: r
		}).get();
		if (n && n.data && n.data.length > 0) return {
			code: 1101,
			msg: "支付宝绑定失败，此账号已被绑定"
		};
		try {
			return 1 === (await j.doc(e).update({
				ali_openid: r
			})).updated ? {
				code: 0,
				msg: "绑定成功"
			} : {
				code: 1102,
				msg: "支付宝绑定失败，请稍后再试"
			}
		} catch (e) {
			return _("写入异常：", e), {
				code: 1104,
				msg: "数据库写入异常"
			}
		}
	},
	unbindAlipay: async function(e) {
		try {
			const t = Er.command,
				r = await j.doc(e).update({
					ali_openid: t.remove()
				});
			return _("upRes:", r), 1 === r.updated ? {
				code: 0,
				msg: "支付宝解绑成功"
			} : {
				code: 1102,
				msg: "支付宝解绑失败，请稍后再试"
			}
		} catch (e) {
			return _("写入异常：", e), {
				code: 1104,
				msg: "数据库写入异常"
			}
		}
	},
	logout: async function(e) {
		const t = await ar.checkToken(e);
		if (t.code && t.code > 0) return t;
		const r = xr.command,
			n = await j.doc(t.uid).update({
				token: r.pull(e)
			});
		return _("logout->upRes", n), 0 === n.updated ? {
			code: 1101,
			msg: "用户不存在"
		} : {
			code: 0,
			msg: "退出成功"
		}
	},
	updatePwd: async function(e) {
		const t = await j.doc(e.uid).get();
		if (_("userInDB:", t), !(t && t.data && t.data.length > 0)) return {
			code: 1101,
			msg: "用户不存在"
		}; {
			const r = t.data[0].password;
			if (T(e.oldPassword) !== r) return {
				code: 1102,
				msg: "密码错误"
			};
			try {
				return _("upRes", await j.doc(t.data[0]._id).update({
					password: T(e.newPassword),
					token: []
				})), {
					code: 0,
					msg: "修改成功"
				}
			} catch (e) {
				return _("发生异常", e), {
					code: 1104,
					msg: "数据库写入异常"
				}
			}
		}
	},
	updateUser: async function(e) {
		const t = e.uid;
		delete e.uid;
		try {
			return _("update -> upRes", await j.doc(t).update(e)), {
				code: 0,
				msg: "修改成功"
			}
		} catch (e) {
			return _("发生异常", e), {
				code: 1104,
				msg: "数据库写入异常"
			}
		}
	},
	setAvatar: async function(e) {
		try {
			return _("setAvatar -> upRes", await j.doc(e.uid).update({
				avatar: e.avatar
			})), {
				code: 0,
				msg: "设置成功"
			}
		} catch (e) {
			return _("发生异常", e), {
				code: 1104,
				msg: "数据库写入异常"
			}
		}
	},
	bindMobile: async function(e) {
		try {
			const t = await j.where({
				mobile: e.mobile,
				mobile_confirmed: 1
			}).count();
			if (t && t.total > 0) return {
				code: 1101,
				msg: "此手机号已被绑定"
			};
			return _("bindMobile -> upRes", await j.doc(e.uid).update({
				mobile: e.mobile,
				mobile_confirmed: 1
			})), {
				code: 0,
				msg: "设置成功"
			}
		} catch (e) {
			return _("发生异常", e), {
				code: 1104,
				msg: "数据库写入异常"
			}
		}
	},
	bindEmail: async function(e) {
		try {
			const t = await j.where({
				email: e.email,
				email_confirmed: 1
			}).count();
			if (t && t.total > 0) return {
				code: 1101,
				msg: "此邮箱已被绑定"
			};
			return _("bindEmail -> upRes", await j.doc(e.uid).update({
				email: e.email,
				email_confirmed: 1
			})), {
				code: 0,
				msg: "设置成功"
			}
		} catch (e) {
			return _("发生异常", e), {
				code: 1104,
				msg: "数据库写入异常"
			}
		}
	},
	checkToken: ar.checkToken,
	encryptPwd: T,
	resetPwd: async function({
		uid: e,
		password: t
	}) {
		try {
			return _("upRes", await j.doc(e).update({
				password: T(t),
				token: []
			})), {
				code: 0,
				msg: "密码重置成功"
			}
		} catch (e) {
			return _("发生异常", e), {
				code: 1104,
				msg: "数据库写入异常"
			}
		}
	}
};
module.exports = jr;
