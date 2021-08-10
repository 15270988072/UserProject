module.exports = {
  /**
   * 用户列表
   */
  userList: async function (req, res) {
    if ('get' === req.method.toLowerCase()) {
      const userList = await User.find();
      return res.view({
        layout: 'admin/layout',
        userList: userList,
      });
    } else {
      var page = parseInt(req.param('page', 1));
      var limit = parseInt(req.param('limit', 10));
      console.log('page', page);
      console.log('limit', limit);
      var obj = {};
      if (req.param('username') && req.param('username').trim() !== '') {
        obj['username'] = { contains: req.param('username').trim() };
      }
      console.log("obj", obj);
      let username = req.param('username');
      if (username == null) {
        username = '%%';
      }else{
        username='%'+username+'%'
      }
      console.log('username',username);
      let test = await sails.sendNativeQuery(`
      select * from user
      where username like $1
      order by sorted_num desc
      limit $2,$3`, [username, (page - 1) * limit, limit])
      console.log("test", test);
      let data = await User.find({
        where: obj,
        limit: limit,
        skip: (page - 1) * limit,
        sort: 'sorted_num desc'
      });
      console.log("data", data);
      var count = await User.count(obj);
      res.json({
        code: 0,
        msg: '',
        count: count,
        data: data
      });
    }
  },

  /**
   * 搜索
   */
  // search: async function (req, res) {
  //   const username = req.param('username').trim();
  //   console.log("params", req.body);
  //   const users = await User.find();
  //   const obj = {};
  //   if (0 < users.length) {
  //     if (null != username && '' != username) {
  //       obj.username = username;
  //       const users = await User.find(obj);
  //       if (users.length > 0) {//显示该用户
  //         return res.json({ users: users, errCode: 0 });
  //       } else {//没有该用户
  //         return res.json({ errCode: 1 });
  //       }
  //     }
  //   } else {//没有数据
  //     console.log('2');
  //     return res.json({ errCode: 2 });
  //   }
  // },

  /**
   * 添加
   */
  add: async function (req, res) {

    if ('get' === req.method.toLowerCase()) {
      console.log("get -----id=");
      return res.view({ layout: 'admin/layout', });
    } else {
      //有个好处可以防止sql注入
      // await sails.sendNativeQuery(` SELECT id FROM xt_meber WHERE id=$2  `, [1, 2]);
      try {
        const username = req.param('username').trim();
        console.log('params', req.body);
        const users = await sails.sendNativeQuery(` SELECT id FROM User WHERE id=$1  `, [username]);
        // const users = await User.findOne({ username: username });
        console.log('users', users);
        if (!users) {
          let rows = await User.create({ username: username, }).fetch();
          console.log("添加成功");
          return res.json({ errCode: 0 });
        } else {
          console.log("该用户名已存在");
          return res.json({ errCode: 1 });
        }
      } catch (e) {
        console.log(e);
      }
    }
  },

  /**
   * 删除
   */
  delete: async function (req, res) {
    try {
      const user_id = req.param('id');
      console.log('user_id', req.body);
      const rows = await sails.sendNativeQuery(`delete from user where id=$1`, [user_id]);
      // const rows = await User.destroy({ id: user_id }).fetch();
      console.log("rows", rows);
      // if(!a)a=window.event;这句话里面是要把它当作对象来使用了,假若对象a为空,赋值为window.event这个事件
      return res.json({
        msg: '删除成功',
        errCode: 0,
      });
    } catch (e) {
      res.json({
        errCode: 1,
        msg: '删除失败，请重试!'
      });
    }
  },

  /**
   * 编辑
   */
  update: async function (req, res) {
    if ('get' === req.method.toLowerCase()) {
      const userId = req.param('userId');
      // const user = await User.findOne({ id: userId });
      const user = await sails.sendNativeQuery(`select * from user where id=$1`, [userId]);
      console.log('user', user);
      return res.view({ layout: 'admin/layout', user: user, });
    } else {
      const username = req.param('username').trim();
      const user_id = req.param('user_id').trim();
      console.log('params', req.body);
      const user = await User.update({ id: user_id }, { username: username }).fetch();;
      console.log('user', user);
      return res.json({ errCode: 0 });
    }
  }
}