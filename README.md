# uiwidgets: Generic HTML User Interface Widgets for Crosstalk

Prototypes for basic user-interface control elements for crosstalk
applications. These elements use crosstalk to mimic some of the basic UI
widgets in shiny.

See https://rstudio.github.io/crosstalk/ for details on crosstalk.

This prototype defines two ridiculously barebones generic widget classes:
transmitter and receiver. Unlike typical crosstalk widgets, these widgets are
_uni-directional_, either transmitting or receiving data, respectively, on the
crosstalk selection interface.

Nor do these widgets use the crosstalk SharedData interface, instead
transmitting raw values from their underlying HTML objects.

They are intended as prototype user-interface control elements, similar to the
control widgets available in shiny. They can be used with other
crosstalk-enabled widgets that can benefit from external user-interface
controls.

This is a crude prototype!

## Dumb Example

```{r}
library(crosstalk)
library(uiwidgets)
library(htmltools)

# only used right now to get a crosstalk group...
s = SharedData$new(data.frame(1:10))

index.set = state.name[1:10]
slider = widget("transmitter", "<input type='range' min='0' max='9'/>", crosstalk=s, width=200)
box = widget("receiver", "<input type='textarea' style='height:200px;font-size:14pt;'/>", crosstalk=s, height=400, width=400)
span = widget("receiver", "<span style='font-size:14pt;'/>", value="innerText", crosstalk=s, width=200, indexed=index.set)

panel = tags$div(class="fluid-row", list(tags$h3("HTML range slider"), slider, tags$h3("the raw slider values in a text box:"), box))
panel2 = tags$div(class="fluid-row", list(tags$h3("an HTML SPAN element with looked up values from the slider:"), span))
x = bscols(panel, panel2, widths=c(3, 9))
```

See the output here:
https://bwlewis.github.io/uiwidgets/example.html
