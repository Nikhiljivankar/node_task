const SuccessResponse = (data = null, records = 0, message = 'Completed', status = 200) => ({
	isSuccess: true,
	status: status,
	message,
	records, // data count
	data, // data
});

module.exports = SuccessResponse;
