var errors = {};
errors.model = function(res){
  return function(err){
    res.json({ 
      success: false,
      errors: err
    });
  };
};
module.exports = errors;
