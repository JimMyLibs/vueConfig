import http from 'utils/Http'

// 通过userid获取用户基本信息
export default function(userId) {
    return http.post('PostUserBaseInfo', {
        apiType: 'product',
        params: {
            UserId: userId,
            version: '1.0'
        }
    })
}
