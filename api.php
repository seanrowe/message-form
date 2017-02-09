<?php
$request_method = $_SERVER['REQUEST_METHOD'];
$post_data = file_get_contents("php://input");
$request = json_decode($post_data);
$action = isset($request->action) ? $request->action : '';

switch($action) {
    case 'message':
        if ('POST' === $request_method) {
            echo postMessage($request);
        } else {
            echo unknownAction($action);
        }
        break;
    default:
        echo unknownAction($action);
}

function unknownAction($action): string
{
    return json_encode([
        'code' => 404,
        'message' => 'You have requested an unknown action: ' . $action
    ]);
}

function postMessage(stdClass $request): string
{
    if (!isset($request->name)) {
        return json_encode([
            'code' => 400,
            'message' => 'Name is required'
        ]);
    }

    if (!isset($request->email)) {
        return json_encode([
            'code' => 400,
            'message' => 'Email is required'
        ]);
    }

    if (!isset($request->message)) {
        return json_encode([
            'code' => 400,
            'message' => 'Message is required'
        ]);
    }

    $to      = 'hire.sean.rowe@gmail.com';
    $subject = $request->name . ' wants to say hi';
    $message = $request->message;
    $headers =  'MIME-Version: 1.0' . "\r\n";
    $headers .= 'From: Your name <' . $request->email . '>' . "\r\n";
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
    $success = mail($to, $subject, $message, $headers);

    if (!$success) {
        return json_encode([
           'code' => 500,
            'message' => 'Unable to send email'
        ]);
    } else {
        return json_encode([
            'code' => 200,
            'message' => 'Message sent successfully'
        ]);
    }
}
