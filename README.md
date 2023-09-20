# Sovendus GTM Tracking Template for external Press Products

1. Einleitung
Sovendus platziert Ihr Angebot bei zahlreichen Werbepartnern im Nachgang an eine Bestellung/Transaktion. Damit wir Ihre Bestellungen korrekt erfassen (zu Abrechnungszwecken) und unseren Werbepartnern zuordnen können, muss auf Ihrer Bestellabschluss- bzw. Dankeseite ein Abrechnungspixel integriert werden.
Hierzu übermittelt Sovendus bei jedem Aufruf einer Landingpage einen generischen Tokenwert, der die Grundlage der Abrechnung von Sovendus darstellt. Der generische Tokenwert wird dynamisch bei jeder Anfrage generiert und ändert sich bei jedem Aufruf. Dieser Tokenwert muss zwischengespeichert und nach dem Bestellabschluss auf Ihrer Landingpage über den Aufruf des Abrechnungspixels auf Ihrer Bestellabschluss- bzw. Dankeseite an Sovendus zurück übermittelt werden.
Hinweis Grundvoraussetzung für die erfolgreiche Zusammenarbeit ist die korrekte Rückspielung des Tokenwerts. Wird der Tokenwert nicht oder nicht korrekt an Sovendus übermittelt, funktioniert der Sovendus-Algorithmus nicht und Ihr Angebot wird nach kurzer Zeit nicht mehr angezeigt. 

2. Externe Product-ID
Zu jeder Kampagne erstellt Sovendus eine feste Product-ID, die beim Aufruf des Abrechnungspixels fest zu hinterlegen ist. Die Product-ID wird Ihnen von Sovendus nach der Produktanlage separat mitgeteilt. Diese hinterlegen Sie als fixen Wert in die Konfiguration des Tracking Templates.

![image](https://user-images.githubusercontent.com/81681270/120794639-c80bf780-c538-11eb-9247-e32e4deadc37.png)


3. Tokenwerte
Bei jedem Aufruf wird an die URL Ihrer Landingpage standardmäßig der Parameter „sovReqToken“ angehängt. Der Wert ist dynamisch und ändert sich bei jedem Klick auf das Angebot. Der Tokenwert muss von Ihnen aus der URL übernommen, zwischengespeichert und nach Bestellabschluss über den Abrechnungspixel ausgegeben werden. Dieser Wert wird im späteren Verlauf als dynamischer Parameter in die Konfiguration des Tracking Templates hinterlegt.

![image](https://user-images.githubusercontent.com/81681270/119667919-ff8eeb80-be36-11eb-8e77-14ff620725eb.png)

Beispiel für das Abgreifen des Tokens bei Aufruf der Landingpage und Speichern in einem Cookie: 

    let sovReqToken = getSovReqTokenFromUrl();

    if (sovReqToken !== null) {
        saveSovReqTokenToCookie(sovReqToken, 1 * 60);
    }

    sovReqToken = loadSovReqTokenFromCookie();

    if (sovReqToken !== null) {
        triggerPixel("12345678-1234-1234-1234-123456789101", sovReqToken);
    }

    function getSovReqTokenFromUrl() {
        let url = new URL(window.location);
        return url.searchParams.get('sovReqToken');
    }

    function saveSovReqTokenToCookie(sovReqToken, seconds) {
        document.cookie=`sovReqToken=${sovReqToken};secure;samesite=strict;max-age=${seconds}`;
    }

Beispiel für das Abgreifen des Tokens aus dem Cookie: 

    function loadSovReqTokenFromCookie() {
        let sovReqToken = null;

        let cookie = document.cookie.split("; ").find(function(entry) {
            return entry.startsWith("sovReqToken=");
        }) || null;

        if (cookie !== null) {
            sovReqToken = cookie.split("=")[1];
        }

        return sovReqToken;
    }

Wenn dieser Wert auf den datalayer des GTM abgelegt wird haben Sie direkt aus der Konfiguration des Templates Zugriff auf die Variable.
Informationen dazu finden sie hier: https://support.google.com/tagmanager/answer/6164391?hl=en


4. Feuern des Pixels
Nachdem Product ID und Token in die Konfiguration des Pixels eingetragen wurde geht es nun darum das Pixel an der richtigen Stelle zu feuern.
Verwenden Sie dazu einen passenden Trigger bzw erstellen diesen und fügen diesen dem Tag hinzu. 
Mehr Informationen zu Triggern finden Sie hier: https://support.google.com/tagmanager/topic/7679384?hl=en&ref_topic=3441647
