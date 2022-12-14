```mermaid
classDiagram
    Helper <|-- XKPasswd
    Helper <|-- Dictionary
    Helper <|-- RNG_Basic
    Helper <|-- Data_Entropy
    Helper <|-- DevUrandom
    Helper <|-- Math_Random_Secure
    Helper <|-- RandomDotOrg
    Helper <|-- Types
    Helper <|-- Util
    
    RNG <|-- RNG_Basic
    RNG <|-- Data_Entropy
    RNG <|-- DevUrandom
    RNG <|-- Math_Random_Secure
    RNG <|-- RandomDotOrg

    Dictionary <|-- Dict_Basic
    Dictionary <|-- System
    Dictionary <|-- DE
    Dictionary <|-- EN
    Dictionary <|-- ES
    Dictionary <|-- FR
    Dictionary <|-- IT
    Dictionary <|-- NL
    Dictionary <|-- PT

    XKPasswd *-- Dictionary 
    XKPasswd *-- Types
    XKPasswd *-- RNG

    class XKPasswd {
        Dictionary dict
        Types types
        RNG generator
        +module_config()
        +defined_config_keys()
        +config_key_definition()
        +config_key_definitions()
        +default_config()
        +preset_definition()
        +preset_definitions()
        +preset_config()
        +presets_json()
        +clone_config()
        +distil_to_config_keys()
        +distil_to_symbol_alphabet()
        +distil_to_words()
        +is_valid_config()
        +config_to_json()
        +config_to_string()
        +preset_description()
        +defined_presets()
        +presets_to_string()
        +config_random_numbers_required()
        +config_stats()
        +dictionary()
        +config()
        +config_as_json()
        +config_as_string()
        +update_config()
        +rng()
        +caches_state()
        +password()
        +passwords()
        +passwords_json()
        +stats()
        +status()
        +hsxkpasswd()
        -_clone_config()
        -_distil_alphabets_inplace()
        -_filter_word_list()
        -_contains_accented_letters()
        -_random_int()
        -_random_digits()
        -_rand()
        -_increment_random_cache()
        -_random_words()
        -_separator()
        -_padding_char()
        -_transform_case()
        -_substitute_characters()
        -_check_config_key_definitions()
        -_check_preset_definitions()
        -_best_available_rng()
        -_calculate_entropy_stats()
        -_calculate_dictionary_stats()
        -_passwords_will_contain_symbol()
        -_update_entropystats_cache()
        -_render_bigint()
        -_grapheme_length()
    }
    class Helper {
        -_do_debug()
        -_debug()
        -_warn()
        -_error()
        -_force_class()
        -_force_instance()
        -__calling_package()
        -__interal_calling_packages()
        -__log()
    }
    class Dictionary {
        +clone()
        +word_list()
        +source()
        +print_words()
        +distil_to_words()
    }
    class Dict_Basic {
        +clone()
        +word_list()
        +source()
        +empty()
        +add_words()
    }
    class System {
        +clone()
        +word_list()
        +source()
    }
    class DE {
        +clone()
        +word_list()
        +source()
    }
    class EN {
        +clone()
        +word_list()
        +source()
    }
    class ES {
        +clone()
        +word_list()
        +source()
    }
    class FR {
        +clone()
        +word_list()
        +source()
    }
    class IT {
        +clone()
        +word_list()
        +source()
    }
    class NL {
        +clone()
        +word_list()
        +source()
    }
    class PT {
        +clone()
        +word_list()
        +source()
    }

    class RNG {
        <<abstract>>
        +random_numbers()
    }
    class RNG_Basic {
        +random_numbers()
    }
    class Data_Entropy {
        +random_numbers()
    }
    class DevUrandom {
        -_rand()
        +random_numbers()
    }
    class Math_Random_Secure {
        +random_numbers()
    }
    class RandomDotOrg {
        +random_numbers()
    }
    class Types {
        +var_to_string()
        -_config_keys()
        -_presets()
        -_config_key_message()
        -_extract_invalid_valued_keys()
        -_extract_missing_required_keys()
        -_extract_unfulfilled_key_interdependencies()

    }
    class Util {
        +test_presets()
        +print_preset_samples()
        +sanitise_dictionary_file()
        +dictionary_from_text_file()
    }
```