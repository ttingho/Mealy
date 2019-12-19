module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define('Member', {
    idx: {
      field: 'idx',
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    id: {
      field: 'id',
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    studentId: {
      field: 'student_id',
      type: DataTypes.STRING,
      allowNull: false,
    },
    pw: {
      field: 'pw',
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      field: 'name',
      type: DataTypes.STRING,
      allowNull: false,
    },
    key: {
      field: 'key',
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'member',
    timestamps: false,
  });

  Member.associate = (models) => {
    Member.hasMany(models.Ticket , {
      foreignKey: 'memberIdx',
    });
  };

  Member.getMember = (id) => Member.findOne({
    attributes: ['idx', 'id', 'name', 'studentId'],
    where: {
      id,
    },
    raw: true,
  });

  Member.getMemberByStudentId = (studentId) => Member.findAll({
    attributes: ['idx', 'id', 'name', 'studentId'],
    where: {
      studentId,
    },
    raw: true,
  })

  Member.getRegisterMember = (key) => Member.findAll({
    where: {
      key,
    },
    raw: true,
  });

  Member.updateMemberInfo = (data) => Member.update({
    id: data.id,
    pw: data.pw,
  }, {
    where: {
      key: data.key,
    },
    raw: true,
  });

  return Member;
};
