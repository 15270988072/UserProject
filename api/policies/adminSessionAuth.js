/**
 * adminSessionAuth
 *
 * @module      :: Policy
 * @description :: 权限相关的验证拦截
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {
  if (req.session.admin) {//登录后跳页面
    return next();
  } else {
    if (req.xhr) {//没有登录post请求就会跳请登录
      return res.json({ errCode: 3, msg: '请先登录！' });
    } else {//get请求就会从定向到登录页面
      return res.redirect('/admin/user/login');
    }
  }
};
