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
        var cf = function(e) {
          if(e.sender === ct_sel1) return;
          var val;
          if(Array.isArray(e.value)) {
            // the usual crosstalk selection array values
            if(x.lookup) {
              val = e.value.map(function(i) {return x.lookup[x.crosstalk_key.indexOf(i)];});
            } else val = e.value;
            if(! Array.isArray(val)) val = [val];
            val = [].concat.apply([], val); // flatten in case lookup returns more than one array?
          } else {
            // non-standard selection object value (FIXME we should switch to using _extraInfo)
            if(x.type && x.type == "object") {
              if(x.lookup) {
                val = {object: x.lookup[x.crosstalk_key.indexOf(e.value.object)]};
              } else val = {object: e.value.object};
            } else {
              if(x.lookup) {
                val = x.lookup[x.crosstalk_key.indexOf(e.value.object)];
              } else val = e.value.object;
              if(! Array.isArray(val)) val = [val];
            }
          }
          ct_sel2.set(val);
        };
        ct_sel1.on("change", cf);
        if(x.init) {
          if(x.type && x.type == "object") {
            if(x.lookup) cf({sender: null, value: {object: x.lookup[x.init]}});
            else cf({sender: null, value: {object: x.init}});
            return;
          }
          var val;
          if(Array.isArray(x.init)) {
            if(x.lookup) val = x.init.map(function(i) {return x.lookup[x.crosstalk_key.indexOf(i)];});
            else val = x.init;
          } else {
            if(x.lookup) val = [x.lookup[x.crosstalk_key.indexOf(x.init)]];
            else val = [x.init];
          }
          cf({sender: null, value: val});
        }
      },
      resize: function(width, height) { }
    };
  }
});
