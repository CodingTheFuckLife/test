(function($){
	//������ʽ
	var baseClasses = "ui-button ui-state-default ui-corner-all",
	//״̬��ʽ
	stateClasses = "ui-state-hover ui-state-active ui-state-focus",
	//��ť������ʽ
	typeClasses = "ui-button-text-only ui-button-icon-only ui-button-text",
	//���button��form���沢����reset���͵�buttonʱ���ø÷������ñ�
	formResetHandler = function(){
		var buttons = $( this ).find( ":ui-button" );
		buttons.button( "refresh" );
	};
	
	$.widget( "ui.button",{
		options:{
			icon:null
		},
		/**
		*
		* ʵ�ָ��෽������ui������
		*
		**/
		_create:function(){
			
			var type = this.getElementType();
			//�����element���ǰ�ťҲ����inputҲ����a��ǩ��ʲô��������
			if (type == null){
				return ;
			}
			
			//���button��form���沢����reset���͵�buttonʱ���ø÷������ñ�
			this.element.closest( "form" )
			.unbind( "reset.button" )
			.bind( "reset.button", formResetHandler );
			
			//�������������õ���el��������
			this.element.attr( "disabled", this.options.disabled );
			
			this.options.label = this.element.html();
			
			var hoverClass = "ui-state-hover",
			    focuClass = "ui-state-focus",
				activeClass = "ui-state-active",
				options = this.options;
			
			/*
			*
			* �����ʽ�ͼ���Ԫ���¼���
			* 1.����꾭�����뿪��ʱ���ui-state-hover��ʽ�����Ƴ�ui-state-hover��ʽ���¼���:mouseenter.button��mouseleave.button
			* 2.��������������ſ�ʱ���ui-state-active��ʽ�����Ƴ�ui-state-active���¼���:mousedown.button��mouseup.button
			* 3.�����̰��¿ո����ȡ�س�����ſ����̰�ťʱ���ui-state-active��ʽ�����Ƴ�ui-state-active��
			* �¼���:mousedown.button��mouseup.button
			*
			*/
			this.element
				.addClass(baseClasses)
				.attr( "role", "button" )
				.bind( "mouseenter.button", function() {
					if ( options.disabled ) {
						return;
					}
					$( this ).addClass( hoverClass );
				})
				.bind( "mouseleave.button", function() {
					if ( options.disabled ) {
						return;
					}
					$( this ).removeClass( hoverClass );
				})
				.bind( "click.button", function( event ) {
					if ( options.disabled ) {
						event.preventDefault();
						event.stopImmediatePropagation();
					}
				})
				.bind( "mousedown.button", function() {
					if ( options.disabled ) {
						return false;
					}
					$( this ).addClass( activeClass );
				})
				.bind( "mouseup.button", function() {
					if ( options.disabled ) {
						return false;
					}
					$( this ).removeClass( activeClass );
				})
				.bind( "keydown.button", function(event) {
					if ( options.disabled ) {
						return false;
					}
					if ( event.keyCode == $.ui.keyCode.SPACE || event.keyCode == $.ui.keyCode.ENTER ) {
						$( this ).addClass( activeClass );
					}
				})
				.bind( "keyup.button", function() {
					$( this ).removeClass( activeClass );
				});
			//�����Ԫ����a��ǩʱ�򣬰��»س��Ϳո��ʱ��������Ԫ�ص�click�¼�
			if ( this.getElementType() == "a" ) {
				this.element.keyup(function(event) {
					if ( event.keyCode === $.ui.keyCode.SPACE || event.keyCode == $.ui.keyCode.ENTER ) {
						$( this ).click();
					}
				});
			}
			
			/**
			*
			* ����ie6/7��buttonһ���borderʱ����inline border���⣬Ϊ�˽��������
			* ���һ��sapn����border��ʽ��������button���߿򣬻���������HTML���롣
			* 
			* <span class="ui-button-ie-border"><button><button></span>
			*
			**/
			if((this.getElementType() == "button" || this.getElementType() == "input") && 
			$.browser.msie && ($.browser.version == "6.0" || $.browser.version == "7.0")) {
				this.element.wrap('<span></span>');
				
			}
			
			//�����Ƿ����
			this._setOption( "disabled", this.options.disabled );
			
			//���ð�ť
			this.resetButton();
		},
		/**
		*
		* ���ð�ť��ʽ
		* �������ɵ�htmlΪ:
		*
		* 1.����icon��button��ǩhtml��
		* <button class="ui-button ui-state-default ui-corner-all">
		*	<span class="ui-button-text ui-button-text-only"> �ı� </span>
		* </button>
		*
		* 2.��icon��button��ǩhtml��
		* <button class="ui-button ui-state-default ui-corner-all">
		*	<span class="ui-button-text ui-button-icon-only user_icon"> �ı� </span>
		* </button>
		*
		* 3.����icon��a��ǩhtml��
		* <a class="ui-button ui-state-default ui-corner-all">
		*	<span class="ui-button-text ui-button-text-only"> �ı� </span>
		* </a>
		*
		* 4.��icon��a��ǩhtml��
		* <a class="ui-button ui-state-default ui-corner-all">
		*	<span class="ui-button-text ui-button-icon-only user_icon"> �ı� </span>
		* </a>
		*
		**/
		resetButton:function(){
			//�����Ԫ��Ϊinput��ǩ�����ܼ��κ�iconֻ���ǵ���������ͱ���ͼƬ
			if ( this.getElementType() === "input" ) {
				if ( this.options.label ) {
					this.element.val( this.options.label );
				}
				return;
			}
			
			//���<span>��ǩ�������ı�
			var buttonText = $( "<span></span>", this.element[0].ownerDocument )
				.addClass( "ui-button-text" )
				.html( this.options.label )
				.appendTo( this.element.empty()),
			icon = this.options.icon;
			
			if ($.isNotEmpty(icon)) {
				buttonText.addClass("ui-button-icon-only " + icon);
			} else {
				buttonText.addClass("ui-button-text-only")
			}
		},
		/**
		*
		* ��ȡԪ�ر�ǩ����
		*
		**/
		getElementType:function(){
			
			if (this.element.is("input")){
				return "input";
			} else if (this.element.is("a")){
				return "a";
			} else if (this.element.is("button")){
				return "button";
			} else {
				return null;
			}
			
		},
		/**
		*
		* ��д���෽���������ui������ʱ��ɾ������css��ԭ������ò��ԭ
		*
		**/
		destroy: function() {
			
			this.element
				.removeClass( baseClasses + " " + stateClasses)
				.removeAttr( "role" )
				.removeAttr( "aria-pressed" )
				.html( this.element.find(".ui-button-text").html() );
			$.Widget.prototype.destroy.call( this );
		},
		/**
		*
		* ��д���෽���������������css�󽫸�Ԫ�ص�disabled��־����
		*
		**/
		_setOption: function( key, value ) {
			$.Widget.prototype._setOption.apply( this, arguments );
			
			if ( key === "disabled" ) {
				if ( value ) {
					this.element.propAttr( "disabled", true );
					if((this.getElementType() == "button" || this.getElementType() == "input") && 
						$.browser.msie && ($.browser.version == "6.0" || $.browser.version == "7.0")) {
						this.element.parent("span").removeClass("ui-button-ie-border").addClass("ui-button-ie-state-disabled");
					}
					if (this.getElementType() == "a" && $.browser.msie && ($.browser.version == "6.0" || $.browser.version == "7.0")) {
						this.element.removeClass("ui-button-ie-border").addClass("ui-button-ie-state-disabled");
						
					}
				} else {
					this.element.propAttr( "disabled", false );
					if((this.getElementType() == "button" || this.getElementType() == "input") && 
						$.browser.msie && ($.browser.version == "6.0" || $.browser.version == "7.0")) {
						this.element.parent("span").removeClass("ui-button-ie-state-disabled").addClass("ui-button-ie-border");
					}
					if (this.getElementType() == "a" && $.browser.msie && ($.browser.version == "6.0" || $.browser.version == "7.0")) {
						this.element.removeClass("ui-button-ie-state-disabled").addClass("ui-button-ie-border");
						
					}
				}
				return;
			}
		}
	});
})(jQuery);