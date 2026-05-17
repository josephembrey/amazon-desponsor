{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }: let
    systems = ["x86_64-linux"];
    forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
  in {
    devShells = forAllSystems (pkgs: {
      default = pkgs.mkShell {
        packages = with pkgs;
          [
            alejandra
            bun
            forgejo-cli
            git
            just
            prek
          ];

        shellHook =
          ''
            # Purge stale hooks from prior installs to avoid conflicts
            rm -rf .git/hooks/*
            prek install -q --overwrite --config tools/prek.toml --hook-type pre-commit
          '';
      };
    });
  };
}
