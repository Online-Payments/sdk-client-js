define("onlinepaymentssdk.PaymentProductField", ["onlinepaymentssdk.core", "onlinepaymentssdk.PaymentProductFieldDisplayHints", "onlinepaymentssdk.DataRestrictions", "onlinepaymentssdk.MaskingUtil"], function(onlinepaymentssdk, PaymentProductFieldDisplayHints, DataRestrictions, MaskingUtil) {
	var PaymentProductField = function (json) {
		this.json = json;
		this.displayHints = json.displayHints ? new PaymentProductFieldDisplayHints(json.displayHints) : '';
		this.dataRestrictions = new DataRestrictions(json.dataRestrictions, this.displayHints ? this.displayHints.mask : '');
		this.id = json.id;
		this.type = json.type;
		var _errorCodes = [];

		this.getErrorCodes = function (value) {
			if (value) {
				_errorCodes = [];
				this.isValid(value);
			}
			return _errorCodes;
		};
		this.isValid = function (value) {
			// isValid checks all datarestrictions
			var validators = this.dataRestrictions.validationRules;
			var hasError = false;

			// Apply masking value first
			var maskedValue = this.applyMask(value);
			value = this.removeMask(maskedValue.formattedValue);
			for (var i = 0, il = validators.length; i < il; i++) {
				var validator = validators[i];
				if (!validator.validate(value)) {
					hasError = true;
					_errorCodes.push(validator.errorMessageId);
				}
			}
			return !hasError;
		};
		this.applyMask = function (newValue, oldValue) {
			var maskingUtil = new MaskingUtil();
			return maskingUtil.applyMask(this.displayHints.mask, newValue, oldValue);
		};
		this.applyWildcardMask = function (newValue, oldValue) {
			var maskingUtil = new MaskingUtil();
			return maskingUtil.applyMask(this.displayHints.wildcardMask, newValue, oldValue);
		};
		this.removeMask = function (value) {
			var maskingUtil = new MaskingUtil();
			return maskingUtil.removeMask(this.displayHints.mask, value);
		};
	};

	onlinepaymentssdk.PaymentProductField = PaymentProductField;
	return PaymentProductField;
});