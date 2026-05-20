<?php
if ((isset($_POST['Name'])) && (strlen(trim($_POST['Name'])) > 0)) {
    $name = stripslashes(strip_tags($_POST['Name']));
} else {
    $name = 'No name entered';
}
if ((isset($_POST['Email'])) && (strlen(trim($_POST['Email'])) > 0)) {
    $email = stripslashes(strip_tags($_POST['Email']));
} else {
    $email = 'No email entered';
}
if ((isset($_POST['Phone'])) && (strlen(trim($_POST['Phone'])) > 0)) {
    $phone = stripslashes(strip_tags($_POST['Phone']));
} else {
    $phone = 'No phone entered';
}
if ((isset($_POST['Message'])) && (strlen(trim($_POST['Message'])) > 0)) {
    $message = stripslashes(strip_tags($_POST['Message']));
} else {
    $message = 'No text entered';
}
ob_start();
?>
<html>
<head>
    <style type="text/css">
    </style>
</head>
<body>
<table width="550" border="0" cellspacing="0" cellpadding="15">
    <tr bgcolor="#eeffee">
        <td>Name</td>
        <td><?php echo $name; ?></td>
    </tr>
    <tr bgcolor="#eeeeff">
        <td>Email</td>
        <td><?php echo $email; ?></td>
    </tr>
    <tr bgcolor="#eeffee">
        <td>Phone</td>
        <td><?php echo $phone; ?></td>
    </tr>
    <tr bgcolor="#eeeeff">
        <td>Message</td>
        <td><?php echo $message; ?></td>
    </tr>
</table>
</body>
</html>
<?php
$body = ob_get_contents();

$to = 'your@domain.com';
$toname = 'Your Name';
//$anotheraddress = 'email@example.com';
//$anothername = 'Another Name';

require("phpmailer.php");

$mail = new PHPMailer();

$mail->From = $email;
$mail->FromName = $name;
$mail->AddAddress($to, $toname); // Put your email
//$mail->AddAddress($anotheraddress,$anothername); // addresses here

$mail->WordWrap = 50;
$mail->IsHTML(true);

$mail->Subject = "Demo Form:  Contact form submitted";
$mail->Body = $body;
$mail->AltBody = $message;

if (!$mail->Send()) {
    $recipient = $to;
    $subject = 'Contact form failed';
    $content = $body;
    mail($recipient, $subject, $content, "From: $name\r\nReply-To: $email\r\nX-Mailer: DT_formmail");
    exit;
}
?>
