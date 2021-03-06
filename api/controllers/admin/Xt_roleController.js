/**
 * Created by WheelerLee.
 * admin/Xt_roleController
 * Copyright 2018 https://github.com/WheelerLee
 */

module.exports = {

  index: async function (req, res) {
    if (req.method.toLowerCase() === 'get') {
      var modify_permission = await PermissionService.valid(req.session.admin.id, '/admin/xt_role/modify');
      var delete_permission = await PermissionService.valid(req.session.admin.id, '/admin/xt_role/delete');
      var distribution_resource_permission = await PermissionService.valid(req.session.admin.id, '/admin/xt_role/distribution_resource');
      console.log("modify_permission",modify_permission);
      console.log("delete_permission",delete_permission);
      return res.view({
        layout: 'admin/layout',
        modify_permission: modify_permission,
        delete_permission: delete_permission,
        distribution_resource_permission: distribution_resource_permission
      });
    } else {
      try {
        console.log("page",req.param('page', 1));
        console.log("limit",req.param('limit', 10));
        var page = parseInt(req.param('page', 1));
        var limit = parseInt(req.param('limit', 10));
        var obj = {};
        if (req.param('name') && req.param('name').trim() !== '') {
          obj['name'] = {
            contains: req.param('name').trim()
          };
        }
        if (req.param('id') && req.param('id').trim() !== '') {
          obj['id'] = req.param('id').trim();
        }
        if (req.param('deleted') && req.param('deleted').trim() !== '') {
          obj['deleted'] = req.param('deleted').trim();
        }
        if (req.param('create_user') && req.param('create_user').trim() !== '') {
          obj['create_user'] = {
            contains: req.param('create_user').trim()
          };
        }
        if (req.param('sorted_num') && req.param('sorted_num').trim() !== '') {
          obj['sorted_num'] = req.param('sorted_num').trim();
        }

        let data = await Xt_role.find({
          where: obj,
          limit: limit,
          skip: (page - 1) * limit,
          sort: 'sorted_num desc'
        });
        var count = await Xt_role.count(obj);
        res.json({
          code: 0,
          msg: '',
          count: count,
          data: data
        });
      } catch (e) {
        res.json({
          code: 1,
          msg: '????????????'
        });
      }
    }
  },

  modify: async function (req, res) {

    var id = req.param('id');
    if (req.method.toLowerCase() === 'get') {
      let xt_role = {};
      if (id) {
        xt_role = await Xt_role.findOne({
          id: id
        });
      }
      return res.view({
        layout: 'admin/layout',
        xt_role: xt_role
      });
    } else {
      var obj = req.body || {};

      try {
        let result;
        if (id) {
          result = await Xt_role.update({
            id: id
          }, obj);
        } else {
          obj.create_user = req.session.admin.id;
          result = await Xt_role.create(obj);
        }

        res.json({
          errCode: 0,
          msg: id ? '????????????' : '????????????',
          data: result
        });
      } catch (e) {
        res.json({
          errCode: 1,
          msg: '????????????????????????'
        });
      }
    }

  },

  delete: async function (req, res) {
    try {
      var id = req.param('id');
      var result = await Xt_role.update({
        id: id
      }, {
        deleted: 1
      });
      res.json({
        errCode: 0,
        msg: '????????????',
        data: result
      });
    } catch (e) {
      res.json({
        errCode: 1,
        msg: '????????????????????????!'
      });
    }
  },

  /**
   * ????????????
   * @param req
   * @param res
   * @returns {Promise.<void>}
   */
  distribution_resource: async function (req, res) {
    if (req.method.toLowerCase() === 'get') {
      try {
        let role_id = req.param('role_id');
        let result = await (Xt_role_resource.find({
          role_id: role_id
        }));
        let xx = function (rs) {
          for (let r of rs) {
            for (let k of result) {
              if (r.id === k.resource_id && (!r.children || r.children.length === 0)) { //????????????????????????????????????checked
                r.checked = true;
                break;
              }
            }
            if (r.children && r.children.length > 0) {
              xx(r.children);
            }
          }
        };
        let resources = await Xt_resource.getAllResources();
        xx(resources);

        return res.view({
          layout: 'admin/layout',
          resources: resources,
          role_id: role_id
        });
      } catch (e) {
        res.serverError(e);
      }
    } else {

      var resources = JSON.parse(req.param('resources', '[]'));
      var role_id = req.param('role_id', '');
      if (!role_id) {
        return res.json({
          errCode: 1,
          msg: '????????????????????????????????????!'
        });
      }

      let a = await sails.getDatastore().transaction(async function (db, proceed) {
        try {
          await (Xt_role_resource.destroy({
            role_id: role_id
          })).usingConnection(db); //????????????????????????????????????????????????
          let xx = async function (rs) {
            for (let r of rs) {
              await Xt_role_resource.create({
                role_id: role_id,
                resource_id: r.id
              }).usingConnection(db);
              if (r.children && r.children.length > 0) {
                xx(r.children);
              }
            }
          };
          await xx(resources);

          return proceed(null, {
            errCode: 0,
            msg: '????????????!'
          });

        } catch (e) {
          return proceed(e);
        }
      });

      return res.json(a);

    }
  }

};
