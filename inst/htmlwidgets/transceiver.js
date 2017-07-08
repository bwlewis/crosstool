HTMLWidgets.widget({
  name: 'transceiver',       // see also transmitter, receiver
  type: 'output',

  factory: function(el, width, height) {
    var ct_sel1 = new crosstalk.SelectionHandle();
    var ct_sel2 = new crosstalk.SelectionHandle();
    return {
      renderValue: function(x) {
        if(x.crosstalk_group) { 
          ct_sel1.setGroup(x.crosstalk_group);
          ct_sel2.setGroup(x.crosstalk_group2);
        } else return;
        ct_sel1.on("change", function(e) {
          if(e.sender === ct_sel1) return;
          var val;
          if(Array.isArray(e.value)) {
            // the usual crosstalk selection array values
            if(x.lookup)
            {
              val = e.value.map(function(i) {return x.lookup[x.crosstalk_key.indexOf(i)];});
            } else val = e.value;
          } else {
            // non-standard selection object value (FIXME we should switch to using _extraInfo)
            if(x.lookup)
            {
              val = [x.lookup[x.crosstalk_key.indexOf(e.value.object)]];
            } else val = [e.value.object];
          }
          ct_sel2.set(val);
        });
      },
      resize: function(width, height) { }
    };
  }
});
