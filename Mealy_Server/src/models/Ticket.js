module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('Ticket', {
    idx: {
      field: 'idx',
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    memberIdx: {
      field: 'member_idx',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mealIdx: {
      field: 'meal_idx',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'ticket',
    timestamps: false,
  });

  Ticket.associate = (models) => {
    Ticket.belongsTo(models.Member , {
      foreignKey: 'memberIdx',
    });

    Ticket.belongsTo(models.Meal, {
      foreignKey: 'mealIdx',
    });
  };

  Ticket.getTicketByIdx = (memberIdx, ticketIdx) => Ticket.findAll({
    where: {
      memberIdx,
      idx: ticketIdx,
    },
  });

  Ticket.getMyTicket = (memberIdx) => sequelize.query(`
    SELECT a.idx AS idx, a.member_idx AS meaberIdx, a.meal_idx AS mealIdx, b.school_name AS schoolName, b.menu AS menu, meal_time AS mealTime, date_format(meal_date, "%Y-%c-%d") AS mealDate
    FROM ticket AS a
    LEFT JOIN meal AS b
    ON a.meal_idx = b.idx
    WHERE a.member_idx = :memberIdx;
  `, {
    type: sequelize.QueryTypes.SELECT,
    replacements: {
      memberIdx,
    },
    raw: true,
  });

  Ticket.getTicketByMemberIdx = (memberIdx, mealIdx) => Ticket.findAll({
    where: {
      mealIdx,
      memberIdx
    },
    raw: true,
  })

  Ticket.createTicket = (memberIdx, mealIdx) => Ticket.create({
    memberIdx, mealIdx,
  });

  Ticket.transferTicket = (originMemberIdx, givenMemberIdx, mealIdx) => Ticket.update({
    memberIdx: givenMemberIdx,
  }, {
    where: {
      idx: mealIdx,
      memberIdx: originMemberIdx,      
    },
    raw: true,
  });

  return Ticket;
};
