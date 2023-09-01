<?php

if ( $_POST['input'] )
    $value = $_POST['input'];

?>
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Untitled</title>
    <link rel="stylesheet" href="com_ui.css">
    <script>
    
    if ( '<?php echo $value; ?>' != '' )
    {
        alert('input=<?php echo $value; ?>');
    }
        
    </script>
</head>

<body>
    <form>
        Input : <input type="text" name="input">
    </form>
</body>
</html>
