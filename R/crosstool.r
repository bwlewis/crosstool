#' Create a generic HTML crosstalk user interface endpoint.
#'
#' Use \code{crosstool} to define generic HTML elements with limited
#' crosstalk functionality. These elements can be used to control
#' crosstalk-enabled applications and to transcode key values across
#' multiple crosstalk groups.
#' @param data A crosstalk SharedData object. Currently only used for the crosstalk group.
#' @param class The transmitter and receiever widgets use limited uni-directional crosstalk
#'        communication. Transceiver widgets are more like normal crosstalk widgets.
#' @param html A valid HTML element string.
#' @param value The HTML object's I/O field name, for instance 'value' for some 'input' HTML elements.
#' @param ... Additional arguments passed directly to the JavaScript code (see the notes).
#' @return An HTML widget object.
#' @note
#' Crosstool behaves differently than many other crosstalk widgets. They generally
#' communicate uni-directionally to other widgets, optionally receiving from and
#' sending to different crosstalk groups. They may transmit raw HTML element
#' values, say from sliders or drop-down menus. They can transcode crosstalk
#' keys through optional lookup vectors.
#'
#' Crosstool widgets currently only use the crosstalk selection interface.
#'
#' @section Receiver-specific options:
#' \itemize{
#'   \item{lookup} optional vector; when specified use values from this vector as
#'      indexed by the crosstalk key.
#' }
#'
#' @section Transmitter-specific options:
#' \itemize{
#'   \item{lookup} optional vector; when specified use values from this vector as
#'      indexed by the crosstalk key.
#'   \item{init} optional scalar or vector; when specified broadcast this value
#'      to the crosstalk group upon initialization.
#' }
#' Note that the HTML object values specified by the \code{value} argument are transmitted.
#'
#' @section Transceiver-specific options:
#' \itemize{
#'   \item{lookup} optional vector; when specified use values from this vector as
#'      indexed by the crosstalk key.
#'   \item{init} optional scalar or vector; when specified broadcast this value
#'      to the crosstalk group upon initialization.
#'   \item{relay} an optinal SharedData object to relay select messages from the
#'    \code{data} group, optionally transcoding them through the \code{lookup}
#'    vector. If \code{relay} is not specified then the 2nd group defaults to
#'    the \code{data} crosstalk group.
#' }
#' This
#' widget ignores the \code{value} and \code{html} arguments--it does not normally
#' have a corresponding visual html component.
#'
#' @examples
#' \dontrun{
#' # Debug/display crosstalk filter key state:
#' library(crosstalk)
#' library(crosstool)
#' library(htmltools)
#' library(d3scatter) # devtools::install_github("jcheng5/d3scatter")
#'
#' x = iris[sample(150, 50), ]
#' rownames(x) = NULL
#' x$key = state.name 
#' sd = SharedData$new(x, key=~key)
#' d1 = d3scatter(sd, x=~Petal.Length, y=~Petal.Width, color=~Species, width="100%")
#' d2 = d3scatter(sd, x=~Sepal.Length, y=~Sepal.Width, color=~Species, width="100%")
#'
#' rx = crosstool(sd, "receiver",  html="<span style='font-size:14pt;'/>", value="innerText", width="100%")
#' bscols(d1, d2, rx, widths=c(4,4,4))
#'
#'
#' # Use 'transmitter' to set initial selection state:
#' x = iris[sample(150, 50), ]
#' rownames(x) = NULL
#' x$key = state.name
#' sd = SharedData$new(x, key=~key)
#' d1 = d3scatter(sd, x=~Petal.Length, y=~Petal.Width, color=~Species, width="100%")
#' d2 = d3scatter(sd, x=~Sepal.Length, y=~Sepal.Width, color=~Species, width="100%")
#'
#' rx = crosstool(sd, "receiver",  html="<span style='font-size:14pt;'/>", value="innerText", width="100%")
#'
# Make an initial random selection and use the 'init' option
#' i = sample(state.name, 10)
#' tx = crosstool(sd, "transmitter", init=i)
#' bscols(d1, d2, rx, tx, widths=c(4,4,4,0))
#' }
#' @importFrom crosstalk is.SharedData
#' @export
crosstool <- function(data, class=c("transmitter", "receiver", "transceiver"),
                     html="", value="value", ..., width=NULL, height=NULL)
{
  x <- c(innerHTML=html, value=value, list(...))
  if (is.SharedData(data))
  {
    if(is.null(x$crosstalk_key)) x$crosstalk_key <- data$key()  # allow key override
    x$crosstalk_group <- data$groupName()
    x$crosstalk_group2 <- data$groupName()
  }
  if("relay" %in% names(x))
  {
    x$crosstalk_group2 <- x$relay$groupName()
    x$relay <- NULL
  }

  htmlwidgets::createWidget(
          name = class,
          x = x,
          width = width,
          height = height,
          htmlwidgets::sizingPolicy(padding = 0, browser.fill = TRUE),
          dependencies = crosstalk::crosstalkLibs(),
          package = "crosstool")
}
