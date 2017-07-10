HTMLWidgets.widget({
  name: 'transmitter',       // see also receiver and transceiver
  type: 'output',

  factory: function(el, width, height) {
    var ct_sel = new crosstalk.SelectionHandle();
    var ct_filter = new crosstalk.FilterHandle();
    return {
      renderValue: function(x) {
        if(x.crosstalk_group) { 
          ct_sel.setGroup(x.crosstalk_group);
          ct_filter.setGroup(x.crosstalk_group);
        }
        el.innerHTML = x.innerHTML;
        el.children[0].addEventListener("change", function() {
          if(x.type && x.type == "object")
          {
            // non-standard selection object value (FIXME we should switch to using _extraInfo)
            ct_sel.set({object: el.children[0][x.value]});
          } else ct_sel.set([el.children[0][x.value]]);
        });
      },
      resize: function(width, height) { }
    };
  }
});
