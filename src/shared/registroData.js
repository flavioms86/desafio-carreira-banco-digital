const { format } = require('date-fns');

const formatarData = (data) => {
    const result = format(data, "yyyy-MM-dd HH:mm:ss");
    return result;
};

module.exports = formatarData;