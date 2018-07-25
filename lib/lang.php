<?php


$acc_lang=$_SERVER['HTTP_ACCEPT_LANGUAGE'];
$browser_lan_arr=explode(",",$acc_lang);

if($languages!="") {
$browser_lan=$languages;
}
else {
$browser_lan=$browser_lan_arr[0];
}

#echo "<br>LANG = $language ($languages)";
#echo "<br>browser_lan = $browser_lan";

class translate {

	public $source;
	public $source_lang;
	public $output_lang;
	public $output;
	public $language_file;
	public $xml_file;
	

   // constructor
    public function __construct($sourcelang,$outputlang) {
        $this->source_lang = $sourcelang;
        $this->output_lang = $outputlang;
    } 


	public function getoutput_lang() {
	return $this->outputlang;
	}

	
	//create file name

	public function create_filename($files) {
		$file="lib/lang_list.txt";
		$file_handle = fopen($file, "rb");
		while (!feof($file_handle) ) {
		
		$line_of_text = fgets($file_handle);
		$parts = explode('|', $line_of_text);
	
		$langnamearr=explode("-",$parts[2]);
	
		if($files==$langnamearr[0]) {
		$this->language_file="master_lang/".$parts[2].".lang";
		return $this->language_file;
		break;
		}
	
		}
	
	}



    public function getfile($outputlang) {
	
	$real_file_arr=explode("-",$outputlang);
	$j=count($real_file_arr);

	if($j>1){
		if($real_file_arr[1]) {
			$hiphen="-";
			}
			else {
				$hiphen='';
				}
			$real_file=$real_file_arr[0].$hiphen.strtoupper($real_file_arr[1]);
			$this->language_file="master_lang/".$real_file.".lang";
			// if file with two char not exist - due to the language change in settings page - from xml file (cldr package)
	}

	if(!file_exists($this->language_file)) {

	$this->create_filename($real_file_arr[0]);
	
	}


	$this->xml_file="main/".$real_file_arr[0].".xml";

	return $this->language_file;
	
	}



	public function readxml($source) {
	if(file_exists($this->xml_file)) {  
	$data = simplexml_load_file($this->xml_file);
		
	}
	else {
	$data = simplexml_load_file("main/en.xml");
	}

	return $data;
	}

   
 public function locales($outputlang) {
	
	$real_file_arr=explode("-",$outputlang);
	$j=count($real_file_arr);
	$real_file=$real_file_arr[0];
	
	if($j>1){
	
		if($real_file_arr[1]) {
			$hiphen="-";
			}
			else {
				$hiphen='';
				}
				$real_file=$real_file_arr[0].$hiphen.strtoupper($real_file_arr[1]);
	}
	
	$locale=$real_file;
	return $locale;
	
	}


	public function readfile($source) {
		
		$file=$this->language_file;
		$text_exist=false;
		
		if(file_exists($file)) {  

		$file_handle = fopen($file, "rb");
		while (!feof($file_handle) ) {
		
		$line_of_text = fgets($file_handle);
		$parts = explode('|', $line_of_text);
		$sources=strtolower($source);
		$csource = strtolower($parts[0]);
		if($sources==$csource)  {
		$text_exist=true;
		$this->output=$parts[1];
		fclose($file_handle);
		return $this->output;
		break;
		
		}
		
		}
	
		fclose($file_handle);
		if($text_exist==false) {
		return $source;
		} 
		}
		
		else {
	return $source;
	}

	}
	


	
	

}
?>
