package serviceid

const (
	AdminService = "admin-service" // 后台服务
	AppService   = "app-service"   // 前台服务

	UserService = "user-service" // 用户服务

	DTMService = "dtm-service" // DTM服务
)

var (
	DtmServiceAddress = MakeDiscoveryAddress(DTMService)
)
