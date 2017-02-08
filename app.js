(function(angular) {
    var module = angular.module("app", ["ngMessages"]);

    (function MessageForm() {
        function MessageFormController($scope, $http) {
            this.scope = $scope;
            this.http = $http;
            this.nameRequired = false;
            this.emailRequired = false;
            this.messageRequired = false;
            this.sendDisabled = true;
            this.messageSent = false;
            this.formData = {
                name: "",
                email: "",
                message: ""
            };
        }

        MessageFormController.prototype.shouldDisableSend = function() {
            var isCleanForm = (
                !this.nameRequired ||
                !this.messageRequired ||
                !this.emailRequired
            );

            if (isCleanForm) {
                return true;
            }

            return (
                this.scope.testForm.fullName.$error.required ||
                this.scope.testForm.email.$error.required ||
                this.scope.testForm.message.$error.required
            );
        };

        MessageFormController.prototype.onNameChange = function() {
            this.sendDisabled = this.shouldDisableSend();
            this.nameRequired = true;
        };

        MessageFormController.prototype.onEmailChange = function() {
            this.sendDisabled = this.shouldDisableSend();
            this.emailRequired = true;
        };

        MessageFormController.prototype.onMessageChange = function() {
            this.sendDisabled = this.shouldDisableSend();
            this.messageRequired = true;
        };

        MessageFormController.prototype.send = function() {
            var self = this;
            self.formData.action = "message";

            self.http({
                method: 'POST',
                url: "/api.php",
                data: self.formData
            })
            .then(function(data) {
                self.messageSent = true;
            })
            .catch(function(error) {
                alert(error.message);
            });
        };

        module.controller("MessageFormController", ["$scope", "$http", MessageFormController]);
    }());

}(angular));