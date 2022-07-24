
(function () {

  angular
      .module('su-destinacao')
      .directive('mapaDestinacao', directive);

    function directive (ol, $document, tipoUtilizacaoService, $filter, $mdDialog) {
        return {
            restrict: 'EA',
            templateUrl: 'scripts-destinacao/app/directives/mapa/templates/mapaDestinacao.html',
            scope: {
              imoveis: '=',
              imagens: '=',
              modoConsulta: '='
            },
            link: function ($scope) {
              angular.element(document).ready(function () {
                var options = {
                  tipLabel: 'Expandir Mapa',
                  zoomInTipLabel: 'Aumentar Zoom',
                  zoomOutTipLabel: 'Diminuir Zoom'
                };

                var fullScreenControl = new ol.control.FullScreen(options);
                var zoomControl = new ol.control.Zoom(options);

                var elementOverlay = $document[0].getElementById('popup');
                var overlay = new ol.Overlay({
                  element: elementOverlay,
                  stopEvent: false,
                  offset: [0, -50]
                });

                var SEM_UTILIZACAO = 12;
                var USO_PROPRIO = 13;

                var source = new ol.source.Vector({wrapX: false});

                var iconStyle = new ol.style.Style({
                  image: new ol.style.Icon({
                    anchor: [0.5, 46],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    opacity: 0.75,
                    src: 'assets/img/icons/pointer.png'
                  })
                });

                var vector = new ol.layer.Vector({
                  source: source,
                  style: iconStyle
                });

                var view = new ol.View({
                  center: ol.proj.fromLonLat([-48.0556, -16.0193]),
                  zoom: 3,
                  projection: "EPSG:3857"
                });

                var OSM = new ol.layer.Tile({
                  source: new ol.source.OSM()
                });

                var layers = [OSM, vector];
                var map = new ol.Map({
                  target: 'map',
                  layers: layers,
                  view: view
                });

                map.addControl(fullScreenControl);
                map.addControl(zoomControl);
                map.addOverlay(overlay);

                map.on('click', function (event) {
                  var feature = map.forEachFeatureAtPixel(event.pixel, function (feature) {
                    return feature;
                  });

                  if (angular.isUndefined($scope.modoConsulta)
                    || $scope.modoConsulta === false) {
                    if (feature) {
                      $scope.imagens = angular.copy(feature.getGeometry().imovel.imagens);
                      $scope.$apply();
                    }
                  } else {
                    if (feature) {
                      mouseHand(feature);
                      mostrarOverlay(feature, getTemplateConsultaImovelOverlay(feature.getGeometry().imovel));
                    } else {
                      removerOverlay(feature);
                    }
                  }

                });

                map.on('pointermove', function (event) {
                  var feature = map.forEachFeatureAtPixel(event.pixel, function (feature) {
                    return feature;
                  });

                  mouseHand(feature);

                  if (angular.isDefined(feature) &&
                    (angular.isUndefined($scope.modoConsulta) || $scope.modoConsulta === false)) {
                    mostrarOverlay(feature, getTemplateInserirImovelOverlay(feature.getGeometry().imovel));
                  }

                  if (angular.isUndefined($scope.modoConsulta) || $scope.modoConsulta === false) {
                    removerOverlay(feature);
                  }
                });

                function mostrarOverlay(feature, template) {
                  if (feature) {
                    var coordinates = feature.getGeometry().getCoordinates();
                    elementOverlay.innerHTML = template;
                    elementOverlay.style.display = 'block';
                    overlay.setPosition(coordinates);
                  } else {
                    if (overlay) {
                      elementOverlay.style.display = 'none';
                    }
                  }
                }

                function removerOverlay(feature) {
                  if (angular.isUndefined(feature)) {
                    elementOverlay.style.display = 'none';
                  }
                }

                function criarFeature(imovel) {
                  var ponto = new ol.geom.Point([imovel.latitude, imovel.longitude]);
                  ponto.imovel = imovel;
                  return new ol.Feature(ponto);
                }

                function marcarPonto(imoveis) {
                  angular.forEach(imoveis, function (imovel) {
                    var featurePonto = criarFeature(imovel);
                    source.addFeature(featurePonto);

                    map.getView().fit(source.getExtent(), /* @type {ol.Size} */ (map.getSize()));
                    if ($scope.imoveis.length == 1) {
                      map.getView().setZoom(15);
                    }
                  });
                }

                $scope.$watch('imoveis', function (newValue) {

                  if (newValue) {
                    vector.getSource().clear();
                    marcarPonto($scope.imoveis);
                  }

                });

                function mouseHand(feature) {
                  var target = angular.element(map.getTargetElement());
                  if (feature) {
                    target.css('cursor', 'pointer');
                  } else {
                    target.css('cursor', '');
                  }
                }

                function getTemplateInserirImovelOverlay(imovel) {
                  var template = "<div style='color:black; background-color:white; width:300px;'>" +
                    "<md-tooltip style='color:black; background-color:white;'>" +
                    "<div class='overlay-content' id='popup-content' style='margin: 3%;'>" +
                    "<p><b>" +
                    "RIP: </b>" + imovel.rip +
                    "</p>" +
                    "<p><b>" +
                    "Endereço: </b>" + imovel.endereco.logradouro +
                    " " + imovel.endereco.numero + ", " + imovel.endereco.municipio +
                    " - " + imovel.endereco.bairro +
                    "</p>" +
                    "<p><b>" +
                    "CEP: </b>" + imovel.endereco.cep +
                    "</p>" +
                    "</div>" +
                    "</md-tooltip>" +
                    "</div>";
                  return template;
                }

                $(elementOverlay).on('click', '#btn-editar-mapa', function () {
                  alert('DEVE CHAMAR A TELA DE EDITAR QUANDO FOR IMPLEMENTADA');
                });

                $(elementOverlay).on('click', '#btn-detalhar-mapa', function () {
                  alert('DEVE CHAMAR A TELA DE DETALHAR QUANDO FOR IMPLEMENTADA');
                });

                $(elementOverlay).on('click', '#btn-excluir-mapa', function () {
                  alert('DEVE CHAMAR A TELA DE CANCELAR QUANDO FOR IMPLEMENTADA');
                });

                $(elementOverlay).on('click', '#btn-nova-mapa', function () {
                  abrirModalNovaSituacaoDestinacao($scope.novoImovel)
                });

                $(elementOverlay).on('click', '#btn-homologar-mapa', function () {
                  alert('DEVE HOMOLOGAR DESTINACAO QUANDO FOR IMPLEMENTADA');
                });

                function lpad(sequencial) {
                  var texto = sequencial.substring(1, sequencial.length - 1);
                  sequencial += '';
                  return texto.length >= 3 ? texto : new Array(3 - texto.length + 1).join('0') + texto;
                }

                function formatarEndereco(endereco) {
                  if (angular.isUndefined(endereco.cidadeExterior) || endereco.cidadeExterior == null) {
                    return endereco.tipoLogradouro + ' ' + endereco.logradouro
                      + ', ' + endereco.numero + ', ' + endereco.bairro + ', '
                      + endereco.municipio + '/' + endereco.pais + '-CEP: ' + endereco.cep;
                  } else {
                    return endereco.cidadeExterior + '-' + endereco.pais;
                  }
                }

                function formatarNumero(valor) {
                  if (angular.isUndefined(valor) || valor == null) {
                    return ' - '
                  }
                  return ' ' + $filter('number')(valor, 2);
                }

                function formatarExibicaoDatasContrato(dataInicioContrato, dataFimContrato) {
                  if (angular.isUndefined(dataInicioContrato) && dataInicioContrato != null
                    && angular.isUndefined(dataFimContrato) && dataFimContrato != null) {
                    return $filter('date')(dataInicioContrato, 'dd/MM/yyyy') + ' a ' + $filter('date')(dataFimContrato, 'dd/MM/yyyy')
                  }
                  return ' Inderminado ';
                }

                function extrairImagem(imovel) {
                  if (angular.isDefined(imovel.imagem) && imovel.imagem != null) {
                    return "<img height='84' width='84' src='data:image/png;base64," + imovel.imagem + "'" + "></img>";
                  }
                  return '';
                }

                function renderizarBotaoNovo(imovel) {

                  if (imovel.tipoDestinacao.id === SEM_UTILIZACAO) {
                    return "<img class='hand' height='22' width='22' id='btn-nova-mapa' src='/assets/img/icons/ic_add_black_18dp_2x.png'></img>";
                  }
                  return "<img class='hand' height='22' width='22' id='btn-editar-mapa' src='/assets/img/icons/ic_edit_black_18dp_2x.png'></img>";
                }

                function renderizarBotaoDetalhar(imovel) {
                  if ((imovel.tipoDestinacao.id !== SEM_UTILIZACAO)
                    && (imovel.statusDestinacao.id !== 3 && imovel.tipoDestinacao.id !== 13)) {
                    return "<img class='hand' height='22' width='22' id='btn-detalhar-mapa' src='/assets/img/icons/ic_search_black_18dp_2x.png'></img>";
                  }
                  return '';
                }

                function renderizarBotaoHomologarCancelar(imovel) {
                  if (imovel.tipoDestinacao.id === USO_PROPRIO
                    && imovel.statusDestinacao.id === 3) {
                    return "<img class='hand' height='22' width='22' id='btn-homologar-mapa' src='/assets/img/icons/ic_refresh_black_24dp_2x.png'></img>";
                  }

                  if ((imovel.tipoDestinacao.id !== SEM_UTILIZACAO)
                    && (imovel.statusDestinacao.id !== 3 && imovel.tipoDestinacao.id !== 13)) {
                    return "<img class='hand' height='22' width='22' id='btn-excluir-mapa' src='/assets/img/icons/ic_cancel_black_18dp_2x.png'></img>";
                  }

                  return '';

                }

                function abrirModalNovaSituacaoDestinacao(imovel, ev) {
                  $mdDialog.show({
                    controller: 'incluirNovaSituacaoDestinacaoController',
                    controllerAs: 'incluirNovaSituacaoDestinacaoCtrl',
                    templateUrl: 'scripts-destinacao/pages/consulta/partials/views/novaSituacaoDestinacao.html',
                    targetEvent: ev,
                    locals: {
                      imovel: imovel
                    }
                  });
                }


                function getTemplateConsultaImovelOverlay(imovel) {
                  $scope.novoImovel = imovel;
                  var template = "<div style='color:black; background-color:white;'>" +
                    "<md-tooltip style='color:black; background-color:white; width: 60%;'>" +
                    "<a href='#' id='popup-closer' class='ol-popup-closer'></a>" +
                    "<div class='overlay-content' id='popup-content' style='margin: 3%; " +
                    "background-color:white; width: 700px;'> " +
                    "<div style='background-color:white; float: left;'> " +
                    "<table style='margin-right: 5px;'>" +
                    "<tr>" +
                    "<td rowspan='6'>" +
                    extrairImagem(imovel) +
                    "</td>" +
                    "<td><b>Código Utilização: </b>" + imovel.rip + "/" + imovel.codigoUtilizacao + "P" + lpad(imovel.sequencialParcela) + "</td>" +
                    "<td style='border-right: 3px solid #F2F2F3; width: 250px;'><b>Situação/Intrumento:</b>" + imovel.tipoDestinacao.descricao + "</td>" +
                    "<td></td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td><b>Utilização:</b>" + tipoUtilizacaoService.formatarUso(imovel.tipoUtilizacao, imovel.subTipoUtilizacao) + "</td>" +
                    "<td style='border-right: 3px solid #F2F2F3; width: 250px;'></td>" +
                    "<td>" +
                    renderizarBotaoDetalhar(imovel) +
                    "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td colspan='2' style='border-right: 3px solid #F2F2F3;'><b>Endereço: </b>" + formatarEndereco(imovel.endereco) + "</td>" +
                    "<td>" +
                    renderizarBotaoNovo(imovel) +
                    "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td><b>Área do terreno:</b>" + formatarNumero(imovel.areaTerreno) + "(m²)</td>" +
                    "<td style='border-right: 3px solid #F2F2F3; width: 250px;'><b>Área Construida:</b>" + formatarNumero(imovel.areaConstruida) + "(m²)</td>" +
                    "<td>"
                    + renderizarBotaoHomologarCancelar(imovel) +
                    "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td colspan='2' style='border-right: 3px solid #F2F2F3;'><b>Nome Responsável:</b>" + (imovel.nomeResponsavel ? imovel.nomeResponsavel : ' - ') + "</td>" +
                    "<td></td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td><b>Vigência:</b>" + formatarExibicaoDatasContrato(imovel.dataInicioContrato, imovel.dataFimContrato) + "</td>" +
                    "<td style='border-right: 3px solid #F2F2F3; width: 250px;'></td>" +
                    "<td></td>" +
                    "</tr>" +
                    "</table>" +
                    "</div>" +
                    "</div>" +
                    "</md-tooltip>" +
                    "</div>";
                  return template;
                }
              });
            }
        };
    }


})();
