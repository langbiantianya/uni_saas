class HttpStatusCode {
    static Continue = new HttpStatusCode(6100, "Continue")
    static SwitchingProtocols = new HttpStatusCode(6101, "Switching Protocols")
    static Processing = new HttpStatusCode(6102, "Processing")
    static OK = new HttpStatusCode(6200, "OK")
    static Created = new HttpStatusCode(6201, "Created")
    static Accepted = new HttpStatusCode(6202, "Accepted")
    static NonAuthoritativeInformation = new HttpStatusCode(6203, "Non-Authoritative Information")
    static NoContent = new HttpStatusCode(6204, "No Content")
    static ResetContent = new HttpStatusCode(6205, "Reset Content")
    static PartialContent = new HttpStatusCode(6206, "Partial Content")
    static MultiStatus = new HttpStatusCode(6207, "Multi-Status")

    static MultipleChoices = new HttpStatusCode(6300, "Multiple Choices")
    static MovedPermanently = new HttpStatusCode(6301, "Moved Permanently")
    static Found = new HttpStatusCode(6302, "Found")
    static SeeOther = new HttpStatusCode(6303, "See Other")
    static NotModified = new HttpStatusCode(6304, "Not Modified")
    static UseProxy = new HttpStatusCode(6305, "Use Proxy")
    static SwitchProxy = new HttpStatusCode(6306, "Switch Proxy")
    static TemporaryRedirect = new HttpStatusCode(6307, "Temporary Redirect")
    static PermanentRedirect = new HttpStatusCode(6308, "Permanent Redirect")

    static BadRequest = new HttpStatusCode(6400, "Bad Request")
    static Unauthorized = new HttpStatusCode(6401, "Unauthorized")
    static PaymentRequired = new HttpStatusCode(6402, "Payment Required")
    static Forbidden = new HttpStatusCode(6403, "Forbidden")
    static NotFound = new HttpStatusCode(6404, "Not Found")
    static MethodNotAllowed = new HttpStatusCode(6405, "Method Not Allowed")
    static NotAcceptable = new HttpStatusCode(6406, "Not Acceptable")
    static ProxyAuthenticationRequired = new HttpStatusCode(6407, "Proxy Authentication Required")
    static RequestTimeout = new HttpStatusCode(6408, "Request Timeout")
    static Conflict = new HttpStatusCode(6409, "Conflict")
    static Gone = new HttpStatusCode(6410, "Gone")
    static LengthRequired = new HttpStatusCode(6411, "Length Required")
    static PreconditionFailed = new HttpStatusCode(6412, "Precondition Failed")
    static PayloadTooLarge = new HttpStatusCode(6413, "Payload Too Large")
    static RequestURITooLong = new HttpStatusCode(6414, "Request-URI Too Long")
    static UnsupportedMediaType = new HttpStatusCode(6415, "Unsupported Media Type")
    static RequestedRangeNotSatisfiable = new HttpStatusCode(6416, "Requested Range Not Satisfiable")
    static ExpectationFailed = new HttpStatusCode(6417, "Expectation Failed")
    static UnprocessableEntity = new HttpStatusCode(6422, "Unprocessable Entity")
    static Locked = new HttpStatusCode(6423, "Locked")
    static FailedDependency = new HttpStatusCode(6424, "Failed Dependency")
    static TooEarly = new HttpStatusCode(6425, "Too Early")
    static UpgradeRequired = new HttpStatusCode(6426, "Upgrade Required")
    static TooManyRequests = new HttpStatusCode(6429, "Too Many Requests")
    static RequestHeaderFieldTooLarge = new HttpStatusCode(6431, "Request Header Fields Too Large")

    static InternalServerError = new HttpStatusCode(6500, "Internal Server Error")
    static NotImplemented = new HttpStatusCode(6501, "Not Implemented")
    static BadGateway = new HttpStatusCode(6502, "Bad Gateway")
    static ServiceUnavailable = new HttpStatusCode(6503, "Service Unavailable")
    static GatewayTimeout = new HttpStatusCode(6504, "Gateway Timeout")
    static VersionNotSupported = new HttpStatusCode(6505, "HTTP Version Not Supported")
    static VariantAlsoNegotiates = new HttpStatusCode(6506, "Variant Also Negotiates")
    static InsufficientStorage = new HttpStatusCode(6507, "Insufficient Storage")

    constructor(value, description) {
        this.value = value
        this.description = description
    }
     
    toString() {
        return this.description
    }
}

module.exports = HttpStatusCode